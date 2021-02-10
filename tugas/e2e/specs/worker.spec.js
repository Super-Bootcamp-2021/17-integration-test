require('cypress-file-upload');

describe('Halaman Manajemen Pekerja', () => {
  it('Berhasil membuka halaman manajemen pekerja', () => {
    cy.visit('/worker.html');
  });

  describe('Daftar Pekerja', () => {
    it('Berhasil mendapatkan daftar pekerja', () => {
      cy.intercept('/list', { fixture: 'workers' }).as('getList');
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#list').children().as('workerList');
      cy.get('@workerList').should('have.length', 3);
      cy.get('@workerList').eq(0).should('contain.text', 'ahmad');
      cy.get('@workerList').eq(1).should('contain.text', 'fauzan');
      cy.get('@workerList').eq(2).should('contain.text', 'maulana');
    });

    it('Berhasil menampilkan foto pekerja', () => {
      const photoSrc = 'http://localhost:7000/photo/';
      cy.intercept('/list', { fixture: 'workers' }).as('getList');
      cy.intercept('/photo/user-1.jpg', { fixture: 'images/user-1.jpg' });
      cy.intercept('/photo/user-2.jpg', { fixture: 'images/user-2.jpg' });
      cy.intercept('/photo/user-3.jpg', { fixture: 'images/user-3.jpg' });
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#list').children().as('workerList');
      cy.get('@workerList').should('have.length', 3);
      cy.get('@workerList')
        .eq(0)
        .find('img')
        .should('have.attr', 'src', `${photoSrc}user-1.jpg`);
      cy.get('@workerList')
        .eq(1)
        .find('img')
        .should('have.attr', 'src', `${photoSrc}user-2.jpg`);
      cy.get('@workerList')
        .eq(2)
        .find('img')
        .should('have.attr', 'src', `${photoSrc}user-3.jpg`);
    });

    const errorText = 'gagal memuat daftar pekerja';

    it('Gagal mendapatkan daftar pekerja ketika data tidak ditemukan', () => {
      cy.intercept('/list', '').as('getList');
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#error-text').should('contain.text', errorText);
    });

    it('Gagal mendapatkan daftar pekerja karena gagal autorisasi', () => {
      cy.intercept('/list', {
        statusCode: 401,
      }).as('getList');
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#error-text').should('contain.text', errorText);
    });

    it('Gagal mendapatkan daftar pekerja karena server error', () => {
      cy.intercept('/list', {
        statusCode: 500,
      }).as('getList');
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#error-text').should('contain.text', errorText);
    });
  });

  describe('Registrasi Pekerja', () => {
    beforeEach(() => {
      cy.intercept('/list', { fixture: 'workers' }).as('getList');
    });

    it('Data pekerja bertambah', () => {
      cy.intercept('/register', {
        id: 4,
        name: 'senkuu',
        age: 5000,
        bio: 'ilmuwan desa ishigami',
        address: 'Desa Ishigami',
        photo: 'user-4.jpg',
      }).as('addWorker');
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#list').children().as('workerList');
      cy.get('@workerList').should('have.length', 3);
      cy.get('input#name').type('senkuu');
      cy.get('input#age').type(5000);
      cy.get('textarea#bio').type('ilmuwan desa ishigami');
      cy.get('textarea#address').type('Desa Ishigami');
      cy.get('input#photo').attachFile('images/user-4.jpg');
      cy.get('#form').submit();
      cy.wait('@addWorker');
      cy.get('@workerList').should('have.length', 4);
    });

    it('Form direset ketika berhasil registrasi', () => {
      cy.intercept('/register', { fixture: 'worker' });
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#list').children().as('workerList');
      cy.get('@workerList').should('have.length', 3);
      cy.get('input#name').type('senkuu');
      cy.get('input#age').type(5000);
      cy.get('textarea#bio').type('ilmuwan desa ishigami');
      cy.get('textarea#address').type('Desa Ishigami');
      cy.get('input#photo').attachFile('images/user-4.jpg');
      cy.get('#form').submit();
      cy.get('input#name').should('be.empty');
      cy.get('input#age').should('be.empty');
      cy.get('textarea#bio').should('be.empty');
      cy.get('textarea#address').should('be.empty');
      cy.get('input#photo').should('be.empty');
    });

    const errorText = 'form isian tidak lengkap!';

    it('Gagal registrasi pekerja karena data tidak lengkap', () => {
      cy.intercept('/register', { name: 'senkuu' });
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('input#name').type('senkuu');
      cy.get('#form').submit();
      cy.get('#error-text').should('contain.text', errorText);
    });
  });

  describe('Hapus Pekerja', () => {
    beforeEach(() => {
      cy.intercept('/list', { fixture: 'workers' }).as('getList');
    });
    it('Data pekerja berkurang', () => {
      cy.intercept('/remove', {
        id: 2,
        name: 'fauzan',
        age: 23,
        bio: 'ngoding seru',
        address: 'Ciputat',
        photo: 'user-2.jpg',
      }).as('delWorker');
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#list').children().as('workerList');
      cy.get('@workerList').should('have.length', 3);
      cy.get('@workerList').eq(1).find('button').click();
      cy.wait('@delWorker');
      cy.get('@workerList').should('have.length', 2);
      cy.get('@workerList').eq(0).should('contain.text', 'ahmad');
      cy.get('@workerList').eq(1).should('contain.text', 'maulana');
    });

    const errorText = 'gagal menghapus pekerja';

    it('Gagal hapus pekerja karena data pekerja tidak ditemukan', () => {
      cy.intercept('/remove', '');
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#list').children().as('workerList');
      cy.get('@workerList').eq(1).find('button').click();
      cy.get('#error-text').should('contain.text', errorText);
    });
  });
});
