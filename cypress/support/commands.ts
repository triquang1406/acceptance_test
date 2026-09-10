/// <reference types="cypress" />

// Custom commands ma cac spec do Test Flow sinh ra dang goi.
// Login that vao iTrust2 (form co CSRF _csrf, username, password).

const APP = '/iTrust2'
const SAMPLE_PASSWORD = '123456'

Cypress.Commands.add('login', (username: string, password: string = SAMPLE_PASSWORD) => {
  // cy.session: dang nhap 1 lan, cac test sau tai lai cookie -> tranh login lai 195 lan.
  cy.session(
    [username, password],
    () => {
      cy.visit(`${APP}/login`)
      cy.get('input[name="username"], #username', { timeout: 60000 })
        .first()
        .clear()
        .type(username)
      cy.get('input[name="password"], #password', { timeout: 60000 })
        .first()
        .clear()
        .type(password, { log: false })
      cy.get('input[type="submit"], button[type="submit"]').first().click()
      cy.url({ timeout: 60000 }).should('not.include', '/login')
    },
    {
      cacheAcrossSpecs: true,
      // Neu test truoc da logout (cookie bi xoa) thi dang nhap lai.
      validate: () => {
        cy.getCookies().should('have.length.greaterThan', 0)
      },
    }
  )
})

Cypress.Commands.add('logout', () => {
  cy.clearCookies()
  cy.clearAllLocalStorage()
  cy.clearAllSessionStorage()
  cy.visit(`${APP}/login`)
})

// --- login theo role (ten command do model sinh ra) ---
Cypress.Commands.add('loginAsAdmin', () => cy.login('admin'))
Cypress.Commands.add('loginAsHCP', () => cy.login('hcp'))
Cypress.Commands.add('loginAsPatient', () => cy.login('patient'))
Cypress.Commands.add('loginAsRegisteredPatient', () => cy.login('patient'))
Cypress.Commands.add('loginAsPatientWithNoDiagnoses', () => cy.login('patient'))
Cypress.Commands.add('loginAsUser', () => cy.login('admin'))
Cypress.Commands.add('loginAsER', () => cy.login('er'))
Cypress.Commands.add('loginAsLabTech', () => cy.login('lt'))

// --- tien de (precondition) ma spec gia dinh la co san ---
// Chua co helper that trong project: log ra de biet test nao dang thieu du lieu.
const stubPrecondition = (name: string, note: string) => {
  Cypress.Commands.add(name as keyof Cypress.Chainable, ((...args: unknown[]) => {
    cy.log(`[chua ho tro] ${name}(${args.map((a) => JSON.stringify(a)).join(', ')}) - ${note}`)
  }) as never)
}

stubPrecondition('recordOfficeVisit', 'can du lieu office visit trong DB')
stubPrecondition('recordMultipleOfficeVisits', 'can nhieu office visit trong DB')
stubPrecondition('clearOfficeVisits', 'can xoa du lieu office visit')
stubPrecondition('setInvalidOfficeVisitId', 'can office visit id khong ton tai')
stubPrecondition('changeAppointmentStatus', 'can doi trang thai appointment request')
stubPrecondition('changePassword', 'can doi mat khau qua API/DB')
stubPrecondition('requestPasswordReset', 'can kich hoat reset password')
stubPrecondition('exceedFailedLogins', 'can gay lockout tai khoan')
stubPrecondition('seedAppointments', 'can du lieu appointment')

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password?: string): Chainable<void>
      logout(): Chainable<void>
      loginAsAdmin(): Chainable<void>
      loginAsHCP(): Chainable<void>
      loginAsPatient(): Chainable<void>
      loginAsRegisteredPatient(): Chainable<void>
      loginAsPatientWithNoDiagnoses(): Chainable<void>
      loginAsUser(): Chainable<void>
      loginAsER(): Chainable<void>
      loginAsLabTech(): Chainable<void>
    }
  }
}

export {}
