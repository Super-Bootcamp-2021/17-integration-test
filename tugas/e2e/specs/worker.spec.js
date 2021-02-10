describe('Worker Page', () => {
  it('bisa buka halaman worker', () => {
    cy.visit('/worker.html');
  });

  describe('tambah worker', () => {
    beforeEach(() => {
      cy.intercept('/list', { fixture: 'workers' }).as('getList');
    });

    it('seharusnya ketika di submit pekerja bertambah', () => {
      cy.intercept('/register', { fixture: 'worker' });
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#name').type('Test');
      cy.get('#age').type('23');
      cy.get('#photo').attachFile('test.jpg');
      cy.get('#bio').type('Test');
      cy.get('#address').type('Test');
      cy.get('#form').submit();
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
  });

  describe('Mengahpus worker', () => {
    beforeEach(() => {
      cy.intercept('/list', { fixture: 'todos' }).as('getList');
    });

    it('seharusnya worker yang dihapus sudah hilang', () => {
      cy.intercept('DELETE', '/done', { id: 1, task: 'makan', done: true });
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#todo-list').children().eq(0).as('makan');
      cy.get('@makan').should('not.have.class', 'todo-done');
      cy.get('@makan').click();
      cy.get('@makan').should('have.class', 'todo-done');
    });
  });

  describe('daftar item', () => {
    it('seharusnya bisa menampilkan item tugas', () => {
      cy.intercept('/list', { fixture: 'workers' }).as('getList');
      cy.visit('/worker.html');
      cy.wait('@getList');
      cy.get('#list').children().as('wokerList');
      cy.get('@wokerList').should('have.length', 3);
    });
  });
});
