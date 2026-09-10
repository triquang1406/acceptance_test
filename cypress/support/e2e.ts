import './commands'

// Bo qua loi uncaught tu ung dung iTrust2 de 1 test loi khong lam fail ca spec.
Cypress.on('uncaught:exception', () => false)
