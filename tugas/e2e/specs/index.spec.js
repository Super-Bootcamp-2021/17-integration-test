describe('Index Page', () => {
  it('bisa buka halaman index', () => {
    cy.visit('/');
  });

  describe('navigation', () => {
    // Ref: https://docs.cypress.io/api/commands/url.html#No-Args
    it('seharusnya bisa melakukan navigasi pindah halaman', () => {
      cy.get('a').contains('pekerja').as('pekerjaNav');
      cy.get('a').contains('pekerjaan').as('pekerjaanNav');
      cy.get('a').contains('kinerja').as('kinerjaNav');
      cy.get('@pekerjaNav').click();
      cy.location().should((loc) => {
        expect(loc.pathname.toString()).to.contain('/worker.html');
      });
      cy.get('@pekerjaanNav').click();
      cy.location().should((loc) => {
        expect(loc.pathname).to.eq('/tasks.html');
      });
      cy.get('@kinerjaNav').click();
      cy.location('pathname').should('include', '/performance.html')
    });
  });
});
