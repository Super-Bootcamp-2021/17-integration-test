describe('Todo Page', () => {
  it('bisa buka halaman todo', () => {
    cy.visit('/');
  });

  describe('tambah item', () => {
    beforeEach(() => {
      cy.intercept('/list', { fixture: 'todos' }).as('getList');
    });

    it('seharusnya ketika di submit item bertambah', () => {
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

    it('seharusnya ketika di submit form di reset', () => {
      cy.intercept('/add', { fixture: 'todo' });
      cy.visit('/');
      cy.wait('@getList');
      cy.get('input#todo').type('main lagi');
      cy.get('#todo-form').submit();
      cy.get('input#todo').should('be.empty');
    });
  });

  describe('tugas selesai', () => {
    beforeEach(() => {
      cy.intercept('/list', { fixture: 'todos' }).as('getList');
    });

    it(
      'seharusnya mencoret task yang dinyatakan selesai',
      { defaultCommandTimeout: 4000 },
      () => {
        cy.intercept('PUT', '/done', { id: 1, task: 'makan', done: true });
        cy.visit('/');
        cy.wait('@getList');
        cy.get('#todo-list').children().eq(0).as('makan');
        cy.get('@makan').should('not.have.class', 'todo-done');
        cy.get('@makan').click();
        cy.get('@makan').should('have.class', 'todo-done');
      }
    );
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

    it('item tugas yang selesai seharusnya dicoret', () => {
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
    });
  });
});
