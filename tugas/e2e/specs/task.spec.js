describe('Halaman  Tasks', () => {
  it('bisa buka halaman tasks', () => {
    cy.visit('/tasks.html');
  });
  describe('mendapatkan list pekerjaan', () => {    
    it('bisa mendapatkan informasi pegawai dan pekerjaannya ', () => {
      cy.intercept('localhost:7001/list',{ fixture: 'workers'}).as('workerlist');
      cy.intercept('localhost:7002/list', { fixture: 'tasks' }).as('tasklist');
      cy.visit('/tasks.html')
      cy.wait('@tasklist');
      cy.wait('@workerlist'); 
      cy.get('#list').children().should('have.length', 4);
      cy.get('#list').children().eq(0).should('have.text', '');
      cy.get('#list').children().eq(0).should('have.text', 4);
      cy.get('#list').children().eq(0).should('have.text', 4);
      cy.get('#list').children().eq(0).should('have.text', 4);
    });
  });
});
