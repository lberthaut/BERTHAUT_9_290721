import {setLocalStorage} from "../../setup-jest"
import { fireEvent, screen} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import firestore from "../app/Firestore.js"
import firebase from "../__mocks__/firebase"


// Setup
const onNavigate= () => {return}
setLocalStorage('Employee')
Object.defineProperty(window, "location", { value: {hash: "#employee/bill/new"} })

describe("Given I am connected as an employee", () => {
  describe("When I browse on NewBill Page", () => {
    test("Then the newbill's page should load", () => {
      document.body.innerHTML= NewBillUI()
      expect(screen.getAllByText("Type de dépense")).toBeTruthy()
    })
  })
  describe("When I'm on NewBill Page", () => {
      test("Then the file's input should show the file when I upload it", () => {
        document.body.innerHTML= NewBillUI()
        const mockNewBill= new NewBill({ document, firestore: firestore, onNavigate, localStorage: window.localStorage })
        const handleChangeFile= jest.fn(() => mockNewBill.handleChangeFile)
        const inputFile= screen.getByTestId("file")
        inputFile.addEventListener("change", handleChangeFile)
        fireEvent.change(inputFile, {
            target: {
                files: [new File(["test.jpg"], "test.jpg", { type: "image/jpg" })],
            }
        })
        expect(inputFile.files[0].name).toBe("test.jpg")
      })
    describe("And I upload a non-supported file", () => {
      test("Then the alert message should be open", async () => {
        document.body.innerHTML = NewBillUI()
        const mockNewBill= new NewBill({ document, firestore: firestore, onNavigate, localStorage: window.localStorage })
        const handleChangeFile= jest.fn(() => mockNewBill.handleChangeFile)
        const loadedFile= screen.getByTestId("file")
        loadedFile.addEventListener("change", handleChangeFile)
        fireEvent.change(loadedFile, {
            target: {
                files: [new File(["test.pdf"], "test.pdf", { type: "application/pdf" })],
            }
        })
        expect(handleChangeFile).toBeCalled()
      })
    })

    // test d'intégration POST
    describe("I submit a agreed bill", () => {
      test('then the bill is created in bills page', async () => {
        document.body.innerHTML= NewBillUI()
        const mockNewBill= new NewBill({ document, firestore: firestore, onNavigate, localStorage: window.localStorage })
        const submitBill= screen.getByTestId('form-new-bill')
        const validBills= await firebase.get();
        const validBill= validBills.data[0];
         /* {
          name: "Test d'une note de frais",
          date: "1988-10-10",
          type: "Services en ligne",
          amount: "5",
          pct: "5",
          vat: "5",
          commentary: "Test du champ commentaires",
          fileName: "Groovy.jpg",
          fileUrl: "https://i.kym-cdn.com/entries/icons/original/000/031/025/cover.jpg"
        } */
        const handleSubmit = jest.fn((e) => mockNewBill.handleSubmit(e))
        mockNewBill.createBill = (newBill) => newBill
        document.querySelector(`select[data-testid="expense-type"]`).value = validBill.type
        document.querySelector(`input[data-testid="expense-name"]`).value = validBill.name
        document.querySelector(`input[data-testid="datepicker"]`).value = validBill.date
        document.querySelector(`input[data-testid="amount"]`).value = validBill.amount
        document.querySelector(`input[data-testid="vat"]`).value = validBill.vat
        document.querySelector(`input[data-testid="pct"]`).value = validBill.pct
        document.querySelector(`textarea[data-testid="commentary"]`).value = validBill.commentary
        mockNewBill.fileName = validBill.fileName 
        mockNewBill.fileUrl = validBill.fileUrl
        submitBill.addEventListener('click', handleSubmit)
        fireEvent.click(submitBill)
        expect(handleSubmit).toHaveBeenCalled()
      })
    })

     test("New Bill is submit and fails with 404 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = NewBillUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("New Bill is submit and fails with 500 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = NewBillUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})

//Test d'un autre étudiant

/* describe("Given I am a user connected as Employee", () => {
  describe("when I create a new bill", () => {
    // vérifie que le post vers la database s'effectue correctement
    test("Add bill from mock API POST", async () => {
      const postSpy = jest.spyOn(firebase, "post");

      const newBill = {
        id: "47qAXb6fIm2zOKkLzMro",
        vat: "80",
        fileUrl:
          "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        status: "refused",
        type: "Hôtel et logement",
        commentAdmin: "Voir avec l'employé",
        commentary: "séminaire billed",
        name: "Facture nuit hotel pour séminaire sur la foudre",
        fileName: "preview-facture-free-201801-pdf-1.jpg",
        date: "2021-05-21",
        amount: 400,
        email: "a@a",
        pct: 20,
      };
      const bills = await firebase.post(newBill);

      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(bills.data.length).toBe(5);
    });
    // verifie que la page error est bien affichée si il y a un reject dans l'appel de la database
    // 404 Ressource non trouvée
    test("Add bill to API and fails with 404 message error", async () => {
      firebase.post.mockImplementationOnce(() => Promise.reject(new Error("Erreur 404")));
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;

      const message = await screen.getByText(/Erreur 404/);

      expect(message).toBeTruthy();
    });
    // verifie que la page error est bien affichée si il y a un reject dans l'appel de la database
    // 500 erreur du serveur
    test("Add bill to API and fails with 500 messager error", async () => {
      firebase.post.mockImplementationOnce(() => Promise.reject(new Error("Erreur 500")));

      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;

      const message = await screen.getByText(/Erreur 500/);

      expect(message).toBeTruthy();
    });
  });
}); */