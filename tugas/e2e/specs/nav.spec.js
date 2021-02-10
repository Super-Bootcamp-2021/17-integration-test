describe('Navigation Page', () => {
  it('bisa buka halaman navigasi', () => {
    cy.visit('/');
  });

  it('terdapat list berisi navigasi ke halaman pekerja, pekerjaan, dan kinerja', () => {
    cy.visit('/');
    cy.get('ul').children('li').as('list');
    cy.get('@list').eq(0).should('contain.text', 'pekerja');
    cy.get('@list').eq(1).should('contain.text', 'pekerjaan');
    cy.get('@list').eq(2).should('contain.text', 'kinerja');
  });

  describe('navigasi ke halaman task manager', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get('ul').children('li').as('list');
    });

    it('seharusnya bisa navigasi ke halaman manajemen pekerja', () => {
      cy.get('@list').eq(0).children('a').click();
      cy.url().should('include', '/worker.html');
    });

    it('seharusnya bisa navigasi ke halaman manajemen pekerjaan', () => {
      cy.get('@list').eq(1).children('a').click();
      cy.url().should('include', '/tasks.html');
    });

    it('seharusnya bisa navigasi ke halaman kinerja', () => {
      cy.get('@list').eq(2).children('a').click();
      cy.url().should('include', '/performance.html');
    });
  });
});
