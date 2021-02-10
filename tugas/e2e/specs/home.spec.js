describe('Navigations', () => {
    it('seharusnya bisa berpindah ke halaman worker', () => {
        cy.visit('/')
        cy.get(':nth-child(1) > a').click()
        cy.url().should('include', '/worker.html')
        cy.url().should('eq', 'http://localhost:7000/worker.html')
    })
    it('seharusnya bisa berpindah ke halaman task', () => {
        cy.visit('/')
        cy.get(':nth-child(2) > a').click()
        cy.url().should('include', '/tasks.html')
        cy.url().should('eq', 'http://localhost:7000/tasks.html')
    })
    it('seharusnya bisa berpindah ke halaman kinerja', () => {
        cy.visit('/')
        cy.get(':nth-child(3) > a').click()
        cy.url().should('include', '/performance.html')
        cy.url().should('eq', 'http://localhost:7000/performance.html')
    })
})