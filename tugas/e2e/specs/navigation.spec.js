describe('Navigation Page', () => {
  it('seharusnya bisa membuka halaman navigasi', () => {
    cy.visit('/index.html');
  });

  describe('Pergi ke halaman lain', () => {
    it('seharusnya bisa pergi ke halaman pekerja', () => {
      cy.get('ul').children().as('menu');
      cy.get('@menu').eq(0).children().click();
      cy.url().should('include', '/worker');
    });

    it('seharusnya bisa pergi ke halaman pekerjaan', () => {
      cy.get('ul').children().as('menu');
      cy.get('@menu').eq(1).children().click();
      cy.url().should('include', '/tasks');
    });

    it('seharusnya bisa pergi ke halaman kinerja', () => {
      cy.get('ul').children().as('menu');
      cy.get('@menu').eq(2).children().click();
      cy.url().should('include', '/performance');
    });
  });
});
