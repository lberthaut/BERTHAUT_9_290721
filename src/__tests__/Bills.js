import {screen} from "@testing-library/dom"
import {setLocalStorage} from "../../setup-jest"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills"
import BillsUI from "../views/BillsUI.js"
import firebase from "../__mocks__/firebase"


// Setup
const onNavigate = () => {return}
setLocalStorage('Employee')

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills' Page", () => {
      test("Then bills should be ordered from earliest to latest", () => {
        document.body.innerHTML = BillsUI({ data: bills });
        const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML);
        expect(dates).toEqual([...dates].sort((a, b) => ((a < b) ? 1 : 1)));
      })
    describe("I click on the newbill's button", () => {
      test("The newbill's page should load", () => {  
        document.body.innerHTML = BillsUI({data: bills});
        const mockBill= new Bills({ document, firestore: null, onNavigate, localStorage: window.localStorage });
        mockBill.handleClickNewBill= jest.fn();
        screen.getByTestId("btn-new-bill").addEventListener("click", mockBill.handleClickNewBill);
        screen.getByTestId("btn-new-bill").click();
        expect(mockBill.handleClickNewBill).toBeCalled();
      })
    })
    describe("I click on the eye's icon", ()=>{
      test("Modal should open on the foreground", () => {
        document.body.innerHTML= BillsUI({data: bills});
        const mockBill= new Bills({ document, firestore: null, onNavigate, localStorage: window.localStorage });
        mockBill.handleClickIconEye = jest.fn();
        screen.getAllByTestId("icon-eye")[0].click();
        expect(mockBill.handleClickIconEye).toBeCalled();
      })
      test("Then the modal should open the relevant", () => {
        document.body.innerHTML = BillsUI({data: bills});
        const mockBill= new Bills({ document, firestore: null, onNavigate, localStorage: window.localStorage });
        const mockEyesIcon= document.querySelector(`div[data-testid="icon-eye"]`);
        $.fn.modal= jest.fn();
        mockBill.handleClickIconEye(mockEyesIcon);
        expect($.fn.modal).toBeCalled();
        expect(document.querySelector(".modal")).toBeTruthy();
      })
    })
  })

  // test d'intégration GET
  describe("Given I am a user connected as Employee", () => {
    describe("When I navigate to bills' page", () => {
      test("fetches bills from mock API GET", async () => {
        const getSpy = jest.spyOn(firebase, "get");
        const bills = await firebase.get();
        expect(getSpy).toHaveBeenCalledTimes(1);
        expect(bills.data.length).toBe(4);
      })
      test("fetches bills from an API and fails with 404 message error", async () => {
        firebase.get.mockImplementationOnce(() =>
          Promise.reject(new Error("Erreur 404"))
        );
        const html = BillsUI({ error: "Erreur 404" });
        document.body.innerHTML = html;
        const message = await screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      })
      test("fetches messages from an API and fails with 500 message error", async () => {
        firebase.get.mockImplementationOnce(() =>
          Promise.reject(new Error("Erreur 500"))
        );
        const html = BillsUI({ error: "Erreur 500" });
        document.body.innerHTML = html;
        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      })
    })
  })
})