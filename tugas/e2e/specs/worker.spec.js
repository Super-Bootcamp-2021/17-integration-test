describe('Worker Page', () => {
  it('bisa buka halaman worker', () => {
    cy.visit('/worker.html');
    cy.get('li').eq(0).children().should('have.attr', 'href', 'worker.html');
    cy.get('li').eq(1).children().should('have.attr', 'href', 'tasks.html');
    cy.get('li').eq(2).children().should('have.attr', 'href', 'performance.html');
  });

  describe('Tambah worker', () => {
    beforeEach(() => {
      cy.intercept('/list', { fixture: 'workers' }).as('getList');
      cy.intercept('/photo/gambar.jpg', { fixture: 'gambar.jpg' }).as('photoWorker');
    });

    it('seharusnya ketika di submit worker bertambah', () => {
      cy.intercept(
        {
          pathname: '/register',
          method: 'POST',
        },
        { fixture: 'worker' }
      ).as('registrasiWorker');
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#name').type('Sil');
      cy.get('#age').type('22');
      cy.get('#photo').attachFile('gambar.jpg');
      cy.get('#bio').type('masih hidup');
      cy.get('#address').type('Bandung');
      cy.get('#form').submit();
      cy.wait('@registrasiWorker');
      cy.get('#list').children().as('listWorker');
      cy.get('@listWorker').should('have.length', 3);
    });

    it('seharusnya ketika di submit worker direset', () => {
      cy.intercept(
        {
          pathname: '/register',
          method: 'POST',
        },
        { fixture: 'worker' }
      ).as('registrasiWorker');
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#name').type('Sil');
      cy.get('#age').type('22');
      cy.get('#photo').attachFile('gambar.jpg');
      cy.get('#bio').type('masih hidup');
      cy.get('#address').type('Bandung');
      cy.get('#form').submit();
      cy.get('#name').should('be.empty');
      cy.get('#age').should('be.empty');
      cy.get('#photo').should('be.empty');
      cy.get('#bio').should('be.empty');
      cy.get('#address').should('be.empty');
    });

    it('error ketika form tidak lengkap', () => {
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
      ).as('registrasiWorker');
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#name').type('Sil');
      cy.get('#age').type('22');
      cy.get('#photo').attachFile('gambar.jpg');
      cy.get('#bio').type('masih hidup');
      cy.get('#address').type('Bandung');
      cy.get('#form').submit();
      cy.wait('@registrasiWorker');
      cy.get('#error-text').should('contain.text', 'gagal mendaftarkan Sil');
    });
  });
  describe('List Worker', () => {
    it('seharusnya bisa menampilkan list worker', () => {
      cy.intercept('/list', { fixture: 'workers' }).as('getList');
      cy.intercept('/photo/gambar.jpg', { fixture: 'gambar.jpg' }).as('photoWorker');
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#list').children().as('listWorker');
      cy.get('@listWorker').should('have.length', 2);
    });
    it('error ketika tidak bisa menampilkan list worker', () => {
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
      cy.get('#error-text').should('contain.text', 'gagal memuat daftar pekerja');
    });
  });

  describe('Menghapus worker', () => {
    beforeEach(() => {
      cy.intercept('/list', { fixture: 'workers' }).as('getList');
      cy.intercept('/photo/gambar.jpg', { fixture: 'gambar.jpg' }).as(
        'photoWorker'
      );
    });

    it('seharusnya bisa mengapus worker dan tidak ada dalam list', () => {
      cy.intercept(
        {
        pathname: '/remove',
        method: 'DELETE',
      },
      { fixture: 'worker' });
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get(':nth-child(1) > button').click();
      cy.get('#list').children().as('listWorker');
      cy.get('@listWorker').should('have.length', 1);
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
});