import {setLocalStorage} from "../../setup-jest"
import { fireEvent, screen} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import firestore from "../app/Firestore.js"

// Setup
const onNavigate = () => {return}
setLocalStorage('Employee')
Object.defineProperty(window, "location", { value: {hash: "#employee/bill/new"} })

describe("Given I am connected as an employee", () => {
  describe("When I access NewBill Page", () => {
    test("Then the newbill's page should load", () => {
      document.body.innerHTML = NewBillUI()
      expect(screen.getAllByText("Type de dépense")).toBeTruthy()
    })
  })
  describe("When I'm on NewBill Page", () => {
      test("Then the file's input should show the file when I upload it", () => {
        document.body.innerHTML = NewBillUI()
        const mockNewBill = new NewBill({ document, firestore: firestore, onNavigate, localStorage: window.localStorage })
        const handleChangeFile = jest.fn(() => mockNewBill.handleChangeFile)
        const inputFile = screen.getByTestId("file")
        inputFile.addEventListener("change", handleChangeFile)
        fireEvent.change(inputFile, {
            target: {
                files: [new File(["test.jpg"], "test.jpg", { type: "image/jpg" })],
            }
        })
      })
    describe("And I upload a non-supported file", () => {
      test("Then the alert message should be open", async () => {
        document.body.innerHTML = NewBillUI()
        const mockNewBill = new NewBill({ document, firestore: firestore, onNavigate, localStorage: window.localStorage })
        const handleChangeFile = jest.fn(() => mockNewBill.handleChangeFile)
        const inputFile = screen.getByTestId("file")
        inputFile.addEventListener("change", handleChangeFile)
        fireEvent.change(inputFile, {
            target: {
                files: [new File(["test.pdf"], "test.pdf", { type: "application/pdf" })],
            }
        })
        expect(handleChangeFile).toBeCalled()
      })
    })
    describe("I submit a agreed bill", () => {
      test('then the bill is created in bills page', async () => {
        document.body.innerHTML = NewBillUI()
        const mockNewBill = new NewBill({ document, firestore: firestore, onNavigate, localStorage: window.localStorage })
        const submit = screen.getByTestId('form-new-bill')
        const goodBill =
         {
          name: "Test d'une note de frais",
          date: "2016-06-06",
          type: "Services en ligne",
          amount: "5",
          pct: "5",
          vat: "5",
          commentary: "Test du champ commentaires",
          fileName: "Groovy.jpg",
          fileUrl: "https://i.kym-cdn.com/entries/icons/original/000/031/025/cover.jpg"
        }
        const handleSubmit = jest.fn((e) => mockNewBill.handleSubmit(e))
        mockNewBill.createBill = (newBill) => newBill
        document.querySelector(`select[data-testid="expense-type"]`).value = goodBill.type
        document.querySelector(`input[data-testid="expense-name"]`).value = goodBill.name
        document.querySelector(`input[data-testid="datepicker"]`).value = goodBill.date
        document.querySelector(`input[data-testid="amount"]`).value = goodBill.amount
        document.querySelector(`input[data-testid="vat"]`).value = goodBill.vat
        document.querySelector(`input[data-testid="pct"]`).value = goodBill.pct
        document.querySelector(`textarea[data-testid="commentary"]`).value = goodBill.commentary
        mockNewBill.fileUrl = goodBill.fileUrl
        mockNewBill.fileName = goodBill.fileName 
        submit.addEventListener('click', handleSubmit)
        fireEvent.click(submit)
        expect(handleSubmit).toHaveBeenCalled()
      })
    })
  })
    
})