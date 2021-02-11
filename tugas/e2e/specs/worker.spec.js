describe('Worker Page', () => {
  it('bisa buka halaman Worker', () => {
    cy.visit('/worker.html');
  });

  describe('menampilkan tabel worker dengan baik', () => {
    it('seharusnya menampilkan data worker sesuai response server', () => {
      cy.intercept('/list', { fixture: 'workers' }).as('getList');
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#list').children().as('workerList');
      cy.get('@workerList').should('have.length', 3);
      cy.get('@workerList').eq(0).should('contain.text', 'makmur');
      cy.get('@workerList').eq(1).should('contain.text', 'alfa');
      cy.get('@workerList').eq(2).should('contain.text', 'gema');
    });
  });

  describe('menambahkan worker baru', () => {
    it('Bisa menambah pekerjaan', () => {
      cy.intercept('/register', { fixture: 'workers' }).as('addWorkers');
      cy.visit('/worker.html');
      cy.wait('@addWorkers');
      cy.get('#name').type('mamet');
      cy.get('#age').select('20');
      cy.get('#photo').attachFile('mamet.jpg');
      cy.get('#bio').type('doyan mandi');
      cy.get('#address').type('Tanggerang');
      cy.get('#form').submit();
      cy.get('#list').children().should('have.length', 0);
    });
  });

  describe('error saat mengambil data worker dari server', () => {
    it('seharusnya menampilkan error', () => {
      cy.intercept('/list', {
        body: 'internal server error',
        statusCode: 500,
        headers: {
          'content-type': 'text/plain',
        },
      }).as('getError');
      cy.visit('/worker.html');
      cy.wait('@getError');
      cy.get('#error-text').should(
        'contain.text',
        'gagal memuat daftar pekerja'
      );
    });
  });
});
