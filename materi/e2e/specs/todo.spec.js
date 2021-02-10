describe('Todo Page', () => {
  it('successfully load app', () => {
    cy.visit('/');
  });

  describe('tambah task', () => {
    it('seharusnya ketika disubmit form di reset', () => {
      cy.intercept('GET', '/list', { fixture: 'todos' });
      cy.intercept('POST', '/add', { fixture: 'todo' });
      cy.visit('/');
      cy.get('input#todo').type('makan');
      cy.get('form#todo-form').submit();
      cy.get('input#todo').should('be.empty');
    });

    it('seharusnya dapat menambahkan item todo', () => {
      cy.intercept('GET', '/list', { fixture: 'todos' });
      cy.intercept('POST', '/add', { id: 9, task: 'bermain', done: false });
      cy.visit('/');
      cy.get('input#todo').type('makan');
      cy.get('form#todo-form').submit();
      cy.get('#todo-list').children().should('have.length', 4);
      cy.get('#todo-list').children().eq(3).should('contain.text', 'bermain');
    });
  });

  describe('tugas selesai', () => {
    it('seharusnya mencoret task yang sudah selesai', { timeout: 4000 }, () => {
      cy.intercept('GET', '/list', { fixture: 'todos' }).as('fetchList');
      cy.intercept('PUT', '/done', { id: 1, task: 'makan', done: true });
      cy.visit('/');
      cy.wait(['@fetchList']);
      cy.get('#todo-list').children().eq(0).as('makan');
      cy.get('@makan').should('not.have.class', 'todo-done');
      cy.get('@makan').click();
      cy.get('@makan').should('have.class', 'todo-done');
    });
  });
});
