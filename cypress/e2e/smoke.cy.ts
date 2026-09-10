// Smoke test: kiem tra khung Cypress (login that + custom command) hoat dong.
describe('smoke: dang nhap iTrust2', () => {
  it('login bang cy.login() roi vao duoc trang admin/users', () => {
    cy.login('admin')
    cy.visit('/iTrust2/admin/users')
    cy.get('body').should('be.visible')
    cy.url().should('include', '/iTrust2/admin/users')
  })
})
