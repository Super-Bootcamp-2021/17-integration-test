describe('Index Page', () => {
  it('Bisa buka halaman index', () => {
    cy.visit('/');
    cy.get('ul')
      .children()
      .eq(0)
      .children()
      .should('have.attr', 'href', 'worker.html');
    cy.get('ul')
      .children()
      .eq(1)
      .children()
      .should('have.attr', 'href', 'tasks.html');
    cy.get('ul')
      .children()
      .eq(2)
      .children()
      .should('have.attr', 'href', 'performance.html');
  });
});
