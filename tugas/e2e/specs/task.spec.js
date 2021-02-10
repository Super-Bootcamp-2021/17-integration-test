require('../../cypress/support');

describe('Task E2E Testing', () => {
  describe('List Tasks', () => {
    it('Should show list task & worker', () => {
      cy.intercept('http://localhost:7002/list', { fixture: 'tasks' }).as(
        'getTaskList'
      );
      cy.intercept('http://localhost:7001/list', {
        fixture: 'workers',
      }).as('getWorkerList');
      cy.intercept('/attachment', { fixture: 'images/example.jpg' }).as(
        'getAttachment'
      );

      cy.visit('/tasks.html');
      cy.get('#list').children().as('taskList');
      cy.get('@taskList').should('have.length', 3);

      cy.get('@taskList').eq(0).children().eq(1).as('task1');
      cy.get('@task1').should('contain.text', 'clarity');

      cy.get('@taskList').eq(1).children().eq(1).as('task2');
      cy.get('@task2').should('contain.text', 'divine');

      cy.get('@taskList').eq(2).children().eq(1).as('task3');
      cy.get('@task3').should('contain.text', 'anchor');
    });

    it('Should show error', () => {
      cy.visit('/tasks.html');
      cy.get('#error-text').should('include.text', 'gagal');
    });
  });

  describe('Add task', () => {
    beforeEach(() => {
      cy.intercept('http://localhost:7002/list', { fixture: 'tasks' }).as(
        'getTasks'
      );
      cy.intercept('http://localhost:7001/list', {
        fixture: 'workers',
      }).as('getWorkers');
      cy.intercept('/attachment', { fixture: 'images/example.jpg' }).as(
        'getAttachment'
      );
      cy.visit('/tasks.html');
    });

    it('should add when submit', () => {
        // cy.wait('@getTasks')
        // cy.wait('@getWorkers')
        // cy.wait('@getAttachment')
      cy.intercept(
        { pathname: '/add', method: 'POST' },
        { fixture: 'task' }
      ).as('addTask');
      
      cy.fixture('images/example.jpg').then((fileContent) => {
        cy.get('input[type="file"]').attachFile({
          fileContent: fileContent.toString(),
          fileName: 'example.jpg',
          mimeType: 'image/jpg',
        });
      });

      cy.get('#job').type('play');
      cy.get('#assignee').select('1');
      cy.get('#submit_task').click();
    // cy.get('#form').submit()

    //   cy.wait('@addTask');
           
    });
  });
});
