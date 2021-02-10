describe('halaman pekerjaan', () => {
  it('bisa membuka halaman pekerjaan', () => {
    cy.visit('/tasks.html');
  });

  describe('menambahkan pekerjaan', () => {
    beforeEach(() => {
      cy.intercept('/attachment/test.txt', { fixture: 'test.txt' }).as(
        'attachmentTask'
      );
      cy.intercept('/photo/test.jpg', { fixture: 'test.jpg' }).as(
        'photoWorker'
      );
      cy.intercept('http://localhost:7001/list', { fixture: 'workers' }).as(
        'workersList'
      );
      cy.intercept('http://localhost:7002/list', { fixture: 'tasks' }).as(
        'tasksList'
      );
    });

    it('seharusnya bisa menambahkan pekerjaan', () => {
      cy.intercept('http://localhost:7002/add', { fixture: 'task-add' }).as(
        'addTask'
      );
      cy.visit('/tasks.html');
      cy.wait('@tasksList');
      cy.wait('@workersList');
      cy.get('#job').type('menyapu');
      cy.get('#assignee').select('Budi');
      cy.get('#attachment').attachFile('test.txt');
      cy.get('#form').submit();
      cy.wait('@addTask');
      cy.get('#list').children().should('have.length', 3);
    });

    it('error jika form tidak lengkap', () => {
      cy.intercept(
        {
          pathname: 'http://localhost:7002/add',
          method: 'POST',
        },
        {
          statusCode: 401,
          headers: {
            'content-type': 'application/json',
          },
        }
      ).as('addTask');
      cy.visit('/tasks.html');
      cy.wait('@tasksList');
      cy.wait('@workersList');
      cy.get('#job').type('menyapu');
      cy.get('#assignee').select('Budi');
      cy.get('#form').submit();
      cy.get('#error-text').should('contain.text', 'form isian tidak lengkap!');
    });
  });

  describe('pekerjaan selesai', () => {
    beforeEach(() => {
      cy.intercept('/attachment/test.txt', { fixture: 'test.txt' }).as(
        'attachmentTask'
      );
      cy.intercept('/photo/test.jpg', { fixture: 'test.jpg' }).as(
        'photoWorker'
      );
      cy.intercept('http://localhost:7001/list', { fixture: 'workers' }).as(
        'workersList'
      );
      cy.intercept('http://localhost:7002/list', { fixture: 'tasks' }).as(
        'tasksList'
      );
    });

    it('seharusnya bisa membuat pekerjaan selesai', () => {
      cy.intercept('PUT', 'http://localhost:7002/done', {
        fixture: 'task-done',
      }).as('doneTask');
      cy.visit('/tasks.html');
      cy.wait('@tasksList');
      cy.wait('@workersList');
      cy.get('#list').get('div button').eq(3).click();
      cy.wait('@doneTask');
      cy.get('#list div').eq(1).should('contain.text', 'sudah selesai');
    });
  });

  describe('pekerjaan batal', () => {
    beforeEach(() => {
      cy.intercept('/attachment/test.txt', { fixture: 'test.txt' }).as(
        'attachmentTask'
      );
      cy.intercept('/photo/test.jpg', { fixture: 'test.jpg' }).as(
        'photoWorker'
      );
      cy.intercept('http://localhost:7001/list', { fixture: 'workers' }).as(
        'workersList'
      );
      cy.intercept('http://localhost:7002/list', { fixture: 'tasks' }).as(
        'tasksList'
      );
    });

    it('seharusnya bisa membuat pekerjaan batal', () => {
      cy.intercept('PUT', 'http://localhost:7002/cancel', {
        fixture: 'task-cancel',
      }).as('cancelTask');
      cy.visit('/tasks.html');
      cy.wait('@tasksList');
      cy.wait('@workersList');
      cy.get('#list').get('div button').eq(2).click();
      cy.wait('@cancelTask');
      cy.get('#list').children().should('have.length', 1);
    });
  });

  describe('menampilkan pekerjaan', () => {
    beforeEach(() => {
      cy.intercept('/attachment/test.txt', { fixture: 'test.txt' }).as(
        'attachmentTask'
      );
      cy.intercept('/photo/test.jpg', { fixture: 'test.jpg' }).as(
        'photoWorker'
      );
      cy.intercept('http://localhost:7001/list', { fixture: 'workers' }).as(
        'workersList'
      );
      cy.intercept('http://localhost:7002/list', { fixture: 'tasks' }).as(
        'tasksList'
      );
    });

    it('seharusnya menampilkan data pekerja', () => {
      cy.visit('/tasks.html');
      cy.wait('@tasksList');
      cy.get('#list').children().should('have.length', 2);
    });
  });
});
