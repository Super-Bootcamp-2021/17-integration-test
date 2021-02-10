describe('Performance Page', () => {
  it('bisa buka halaman kinerja', () => {
    cy.visit('/performance.html');
  });

  describe('menampilkan tabel kinerja dengan baik', () => {
    it('seharusnya menampilkan data kinerja sesuai response server', () => {
      cy.intercept('/summary', { fixture: 'kinerja' }).as('getPerformance');
			cy.visit('/performance.html');
			cy.get('#loading-text').should('have.css', 'display').and('not.match', /none/);
      cy.wait('@getPerformance');
      cy.get('#workers').should('contain.text', '10');
			cy.get('#tasks').should('contain.text', '20');
			cy.get('#task-done').should('contain.text', '9');
			cy.get('#task-canceled').should('contain.text', '3');
			cy.get('#error-text').should('not.contain.text', 'gagal memuat informasi kinerja');
			cy.get('#loading-text').should('have.css', 'display').and('match', /none/);
    });
	});

  describe('error saat mengambil data kinerja dari server', () => {
    it('seharusnya menampilkan error', () => {
      cy.intercept(
				'/summary',
				{
          body: 'internal server error',
          statusCode: 500,
          headers: {
            'content-type': 'text/plain',
          },
        }
			).as('getError');
			cy.visit('/performance.html');
      cy.wait('@getError');
      cy.get('#error-text').should('contain.text', 'gagal memuat informasi kinerja');
    });
		
		it('seharusnya bisa refresh', () => {
			cy.intercept('/summary', { fixture: 'kinerja' }).as('getPerformance');
			cy.get('#refresh').click();
			cy.wait('@getPerformance');
      cy.get('#workers').should('contain.text', '10');
			cy.get('#tasks').should('contain.text', '20');
			cy.get('#task-done').should('contain.text', '9');
			cy.get('#task-canceled').should('contain.text', '3');
			cy.get('#error-text').should('not.contain.text', 'gagal memuat informasi kinerja');
		});
  });
});

