describe('halaman pekerjaan', () => {
  it('Halaman Pekerjaan bisa dibuka', () => {
    cy.visit('/tasks.html');
  });

  describe('Add Task', () => {
    beforeEach(() => {
      cy.intercept('/attachment/test.txt', { fixture: 'test.txt' }).as(
        'attachmentTask'
      );
      cy.intercept('http://localhost:7001/list', { fixture: 'workers' }).as(
        'workersList'
      );
    });
    it('Bisa menambah pekerjaan', () => {
      cy.visit('/tasks.html');
      cy.wait('@workersList');
      cy.get('#job').type('Ngedota');
      cy.get('#assignee').select('Bilal');
      cy.get('#attachment').attachFile('test.txt');
      cy.get('#form').submit();
      cy.get('#list').children().should('have.length', 0);
    });

    it('error apabila form tidak lengkap', () => {
      cy.visit('/tasks.html');
      cy.wait('@workersList');
      cy.get('#job').type('ngaji');
      cy.get('#assignee').select('Alex');
      cy.get('#form').submit();
      cy.get('#error-text').should('contain.text', 'form isian tidak lengkap!');
    });
  });

  describe('done task', () => {
    beforeEach(() => {
      cy.intercept('/attachment/test.txt', { fixture: 'test.txt' }).as(
        'attachmentTask'
      );
      cy.intercept('http://localhost:7002/list', { fixture: 'tasks' }).as(
        'tasksList'
      );
    });
    it('Pekerjaan dapat diselesaikan', () => {
      cy.intercept('PUT', 'http://localhost:7002/done', {
        fixture: 'task-done',
      }).as('doneTask');
      cy.visit('/tasks.html');
      cy.wait('@tasksList');
      cy.get('#list').get('div button').eq(3).click();
      cy.wait('@doneTask');
      cy.get('#list div').eq(1).should('contain.text', 'sudah selesai');
    });
  });

  describe('pekerjaan batal', () => {
    beforeEach(() => {
      cy.intercept('http://localhost:7001/list', { fixture: 'workers' }).as(
        'workersList'
      );
      cy.intercept('http://localhost:7002/list', { fixture: 'tasks' }).as(
        'tasksList'
      );
    });

    it('Pekerjaan dapat dibatalkan', () => {
      cy.intercept('PUT', 'http://localhost:7002/cancel', {
        fixture: 'task-cancel',
      }).as('cancelTask');
      cy.visit('/tasks.html');
      cy.wait('@tasksList');
      cy.wait('@workersList');
      cy.get('#list').get('div button').eq(2).click();
      cy.wait('@cancelTask');
      cy.get('#list').children().should('have.length', 1);
      cy.get('#list > :nth-child(1) > :nth-child(2)').should('contain.text', 'ngoding');
    });
  });

  describe('menampilkan pekerjaan', () => {
    beforeEach(() => {
      cy.intercept('http://localhost:7001/list', { fixture: 'workers' }).as(
        'workersList'
      );
      cy.intercept('http://localhost:7002/list', { fixture: 'tasks' }).as(
        'tasksList'
      );
    });

    it('Pekerjaan dapat ditampilkan', () => {
      cy.visit('/tasks.html');
      cy.wait('@tasksList');
      cy.get('#list').children().should('have.length', 2);
      cy.get('#list > :nth-child(1) > :nth-child(2)').should('contain.text', 'ngoding');
      cy.get('#list > :nth-child(1) > :nth-child(3)').should('contain.text', 'Alex');
      cy.get('#list > :nth-child(2) > :nth-child(2)').should('contain.text', 'memanah');
      cy.get('#list > :nth-child(2) > :nth-child(3)').should('contain.text', 'Bilal');
    });
  });
});
