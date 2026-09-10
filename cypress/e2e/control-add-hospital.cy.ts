// CONTROL TEST: cung kich ban "Add Hospital" nhung dung selector THAT cua app.
// Muc dich: chung minh Cypress + app hoat dong, loi nam o selector do spec sinh ra.
describe('control: Add Hospital voi selector that', () => {
  it('them hospital thanh cong', () => {
    cy.login('admin')
    cy.visit('/iTrust2/admin/hospitals')

    cy.get('input[name="name"]').type('Cypress General Hospital')
    cy.get('input[name="address"]').type('123 Main St')
    cy.get('select[name="state"]').select('CA')
    cy.get('input[name="zipcode"]').type('12345')
    cy.get('#submit').click()

    cy.contains('Cypress General Hospital', { timeout: 15000 }).should('exist')
  })
})
