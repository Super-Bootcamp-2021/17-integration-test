describe('Worker Page', () => {
  it('bisa buka halaman worker', () => {
    cy.visit('/worker.html');
  });

  describe('tambah worker', () => {
    beforeEach(() => {
      cy.intercept('/list', { fixture: 'workers' }).as('getList');
      cy.intercept('/photo/test.jpg', { fixture: 'test.jpg' }).as(
        'photoWorker'
      );
    });

    it('seharusnya ketika di submit pekerja bertambah', () => {
      cy.intercept('/register', { fixture: 'worker' }).as('regisWorker');
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#name').type('Test');
      cy.get('#age').type('23');
      cy.get('#photo').attachFile('test.jpg');
      cy.get('#bio').type('Test');
      cy.get('#address').type('Test');
      cy.get('#form').submit();
      cy.wait('@regisWorker');
      cy.get('#list').children().as('wokerList');
      cy.get('@wokerList').should('have.length', 4);
    });

    it('seharusnya ketika di submit form di reset', () => {
      cy.intercept('/register', { fixture: 'worker' });
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#name').type('Test');
      cy.get('#age').type('23');
      cy.get('#photo').attachFile('test.jpg');
      cy.get('#bio').type('Test');
      cy.get('#address').type('Test');
      cy.get('#form').submit();
      cy.get('#name').should('be.empty');
      cy.get('#age').should('be.empty');
      cy.get('#photo').should('be.empty');
      cy.get('#bio').should('be.empty');
      cy.get('#address').should('be.empty');
    });
    it('Error ketika form tidak lengkap', () => {
      cy.intercept(
        {
          pathname: '/register',
          method: 'POST',
        },
        {
          statusCode: 401,
          headers: {
            'content-type': 'application/json',
          },
        }
      ).as('regisWorker');
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#name').type('Test');
      cy.get('#age').type('23');
      cy.get('#photo').attachFile('test.jpg');
      cy.get('#bio').type('Test');
      cy.get('#address').type('Test');
      cy.get('#form').submit();
      cy.wait('@regisWorker');
      cy.get('#error-text').should('contain.text', 'gagal mendaftarkan Test');
    });
  });

  describe('Mengahapus worker', () => {
    beforeEach(() => {
      cy.intercept('/list', { fixture: 'workers' }).as('getList');
      cy.intercept('/photo/test.jpg', { fixture: 'test.jpg' }).as(
        'photoWorker'
      );
    });

    it('seharusnya worker yang dihapus sudah hilang', () => {
      cy.intercept('DELETE', '/remove', { fixture: 'worker' });
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get(':nth-child(1) > button').click();
      cy.get('#list').children().as('wokerList');
      cy.get('@wokerList').should('have.length', 2);
    });

    it('Ketika error bisa menampilkan gagal menghapus pekerja', () => {
      cy.intercept(
        {
          pathname: '/remove',
          method: 'DELETE',
        },
        {
          statusCode: 500,
          headers: {
            'content-type': 'application/json',
          },
        }
      ).as('deleteList');
      cy.visit('/worker.html');
      cy.get(':nth-child(1) > button').click();
      cy.wait('@deleteList');
      cy.get('#error-text').should('contain.text', 'gagal menghapus pekerja');
    });
  });

  describe('daftar pekerja', () => {
    it('seharusnya bisa menampilkan item tugas', () => {
      cy.intercept('/list', { fixture: 'workers' }).as('getList');
      cy.intercept('/photo/test.jpg', { fixture: 'test.jpg' }).as(
        'photoWorker'
      );
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#list').children().as('wokerList');
      cy.get('@wokerList').should('have.length', 3);
    });
    it('Ketika error bisa menampilkan gagal memuat daftar pekerja', () => {
      cy.intercept(
        {
          pathname: '/list',
          method: 'GET',
        },
        {
          statusCode: 500,
          headers: {
            'content-type': 'application/json',
          },
        }
      ).as('getList');
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#error-text').should(
        'contain.text',
        'gagal memuat daftar pekerja'
      );
    });
  });
});
