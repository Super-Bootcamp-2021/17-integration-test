describe('navigation page', () =>{
    it('can open navigation page', () => {
        cy.visit('/');
    })

    it('can move to page worker', () => {
        cy.visit('/');
        cy.get('#menuWorker').click();
        cy.url().should('include', '/worker')
        // cy.url().should('eq', 'http://localhost:5757/worker.html')
    })

    it('can move to page task', () => {
        cy.visit('/');
        cy.get('#menuTask').click();
        cy.url().should('include', '/tasks')
        // cy.url().should('eq', 'http://localhost:5757/tasks.html')
    })

    it('can move to page performance', () => {
        cy.visit('/');
        cy.get('#menuPerformance').click();
        cy.url().should('include', '/performance')
        // cy.url().should('eq', 'http://localhost:5757/performance.html')
    })
})