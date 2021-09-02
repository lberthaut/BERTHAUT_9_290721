import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import firestore from "../app/Firestore.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {

    test('User should disconnect his session by clicking on the logout button', () => {
      jest.mock(Logout);
      beforeEach(() => {
        Logout.mockClear();
      })
      const logoutButton = document.getElementById('layout-disconnect');
      expect (Logout).toHaveBeenCalledWith(logoutButton);
    })

    test('User shloud load a file', () => {
      const loadFileButton = document.getElementsByClassName('form-control');
      expect(newBills.handleChangeFile).toHaveBeenCalledWith(loadFileButton);
    })
    
    test('User should submit the form by clicking on the submit button', () => {
      const submitButton = document.getElementById('btn-send-bill');
      expect(newBills.handleSubmit).toHaveBeenCalledWith(submitButton);
    })
  })
})