import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { handleClickNewBill } from "../containers/bills.js"
import Logout from "../containers/Logout.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
   /*  test("Then bill icon in vertical layout should be highlighted", () => {
   const html = BillsUI({ data: []})
      document.body.innerHTML = html
      //to-do write expect expression
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
     */
    test('User should click on the new bills button', () => {
      const billButton = jest.fn();
      expect(handleClickNewBill(billButton)).toHaveBeenCalled();
    })

    test('User should open a bill when he click on the eye button', () => {
      const eyeButton = jest.fn();
      Bills.handleClickIconEye(eyeButton);
      expect(Bills.eyeButton).toHaveBeenCalled();
    })

    test('User should disconnect his session by clicking on the logout button', () => {
      jest.mock(Logout);
      beforeEach(() => {
        Logout.mockClear();
      })
      const logoutButton = document.getElementById('layout-disconnect');
      expect (Logout).toHaveBeenCalledWith(logoutButton);
    })
  })
})