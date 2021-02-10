describe('Todo Page', () => {
  it('bisa buka halaman todo', () => {
    cy.visit('/');
  });

  describe('tambah item', () => {
    it('seharusnya ketika di submit item bertambah', () => {
      cy.intercept('/list', { fixture: 'todos' }).as('getList');
      cy.intercept('/add', { id: 4, task: 'main', done: false });
      cy.visit('/');
      cy.wait('@getList');
      cy.get('input#todo').type('main');
      cy.get('#todo-form').submit();
      cy.get('#todo-list').children().as('todoList');
      cy.get('@todoList').should('have.length', 4);
      cy.get('@todoList').eq(3).should('contain.text', 'main');
      cy.get('@todoList').eq(3).should('not.have.class', 'todo-done');
    });
  });

  describe('daftar item', () => {
    it('seharusnya bisa menampilkan item tugas', () => {
      cy.intercept(
        {
          pathname: '/list',
          method: 'GET',
        },
        {
          body: [
            { id: 1, task: 'makan', done: false },
            { id: 2, task: 'minum', done: true },
            { id: 3, task: 'ngoding', done: false },
          ],
          statusCode: 200,
          headers: {
            'content-type': 'application/json',
          },
        }
      ).as('getList');
      cy.visit('/');
      cy.wait('@getList');
      cy.get('#todo-list').children().as('todoList');
      cy.get('@todoList').should('have.length', 3);
      cy.get('@todoList').eq(0).should('contain.text', 'makan');
      cy.get('@todoList').eq(1).should('contain.text', 'minum');
      cy.get('@todoList').eq(2).should('contain.text', 'ngoding');
    });

    it('item tugas yang selesai seharusnya dicoret', { timeout: 3000 }, () => {
      cy.intercept('/list', [
        { id: 1, task: 'makan', done: false },
        { id: 2, task: 'minum', done: true },
        { id: 3, task: 'ngoding', done: false },
      ]).as('getList');
      cy.visit('/');
      cy.wait('@getList');
      cy.get('#todo-list').children().as('todoList');
      cy.get('@todoList').eq(0).should('not.have.class', 'todo-done');
      cy.get('@todoList').eq(1).should('have.class', 'todo-done');
      cy.get('@todoList').eq(2).should('not.have.class', 'todo-done');
    });
  });
});
