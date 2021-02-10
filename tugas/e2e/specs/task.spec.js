require('../../cypress/support');

function init() {
  cy.intercept('http://localhost:7002/list', {
    fixture: 'tasks',
  }).as('getTasks');
  cy.intercept('http://localhost:7001/list', {
    fixture: 'workers',
  }).as('getWorkers');
  cy.intercept('/attachment', { fixture: 'images/example.jpg' }).as(
    'getAttachment'
  );
  cy.visit('/tasks.html');
}

describe('Task E2E Testing', () => {
  describe('List Tasks', () => {
    it('Should show list task & worker', () => {
      init();

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
    // beforeEach(() => {
    //   init();
    // });

    it('should add when submit', () => {
      cy.intercept('/add', { fixture: 'task' }).as('addTask');

      cy.fixture('images/example.jpg').then((fileContent) => {
        cy.get('input[type="file"]').attachFile({
          fileContent: fileContent.toString(),
          fileName: 'example.jpg',
          mimeType: 'image/jpg',
        });
      });

      cy.get('#job').type('play');
      cy.get('#assignee').select('1');
      cy.get('#form').submit();

      cy.wait('@addTask');
    });
  });

  describe('Done Task Action', () => {
    beforeEach(() => {
      init();
    });

    afterEach(function (done) {
      done();
    });

    it('Should done when clicked', () => {
      cy.intercept('/done', { fixture: 'task' }).as('doneTask');
      cy.get('#list').children().eq(0).children().eq(4).as('doneBtn');
      cy.get('@doneBtn').click();
      cy.wait('@doneTask');
      cy.get('#list').should('include.text', 'sudah selesai');
    });

    it("Shouldn't done when clicked", () => {
      cy.get('#list').children().eq(0).children().eq(4).as('doneBtn2');
      cy.get('@doneBtn2').click();
      cy.get('#error-text').should('include.text', 'gagal');
      cy.get('#list').should('not.include.text', 'sudah selesai');
    });
  });

  describe('Cancel Task Action', () => {
    // beforeEach(() => {
    //   init();
    // });

    afterEach(function (done) {
      done();
    });

    it('Should cancel when clicked', () => {
      cy.intercept('/cancel', { fixture: 'task' }).as('cancelTask');
      cy.get('#list').children().eq(1).children().eq(3).as('cancelBtn');
      cy.get('@cancelBtn').click();
      cy.wait('@cancelTask');
    });

    it("Shouldn't cancel when clicked", () => {
      cy.get('#list').children().eq(0).children().eq(4).as('cancelBtn2');
      cy.get('@cancelBtn2').click();
      cy.get('#error-text').should('include.text', 'gagal');
    });
  });
  describe.skip('Navigation test', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('Should visit worker', () => {
      cy.get(':nth-child(1) > a').click();
      cy.url().should('eq', 'http://localhost:7000/worker.html');
    });

    it('Should visit task', () => {
      cy.get(':nth-child(2) > a').click();
      cy.url().should('eq', 'http://localhost:7000/tasks.html');
    });

    it('Should visit performance', () => {
      cy.get(':nth-child(3) > a').click();
      cy.url().should('eq', 'http://localhost:7000/performance.html');
    });
  });
});
