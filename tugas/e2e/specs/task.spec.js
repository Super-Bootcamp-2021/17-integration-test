describe('Task Page', () => {
  it('bisa buka halaman task/pekerjaan', () => {
    cy.visit('/tasks.html');
  });

  describe('daftar pekerjaan', () => {
    it('seharusnya bisa menampilkan daftar pekerjaan', () => {
      cy.intercept('GET', 'http://localhost:7001/list', {
        body: [
          { id: 1, name: 'budi' },
          { id: 2, name: 'adit' },
          { id: 3, name: 'diana' },
        ],
      }).as('getWorkersList');
      cy.intercept(
        {
          pathname: '/list',
          method: 'GET',
        },
        {
          body: [
            { id: 1, job: 'makan', assignee: { name: 'budi' }, done: false },
            { id: 2, job: 'belajar', assignee: { name: 'adit' }, done: false },
            { id: 3, job: 'tidur', assignee: { name: 'budi' }, done: false },
          ],
          statusCode: 200,
          headers: {
            'content-type': 'application/json',
          },
        }
      ).as('getTaskList');
      cy.visit('/tasks.html');
      cy.wait('@getWorkersList');
      cy.wait('@getTaskList');
      cy.get('#list').children().as('taskList');
      cy.get('@taskList').should('have.length', 3);
      cy.get('@taskList').eq(0).should('contain.text', 'makan');
      cy.get('@taskList').eq(1).should('contain.text', 'belajar');
      cy.get('@taskList').eq(2).should('contain.text', 'tidur');
    });
  });

  describe('tambah pekerjaan', () => {
    beforeEach(() => {
      cy.intercept('GET', 'http://localhost:7001/list', {
        fixture: 'workerTask',
      }).as('workerList');
      cy.intercept('GET', 'http://localhost:7002/list', {
        fixture: 'tasks',
      }).as('taskList');
    });

    it('seharusnya ketika disubmit item bertambah', () => {
      cy.intercept('/add', {
        id: 4,
        job: 'makan siang',
        assignee: { name: 'budi' },
        done: false,
      });
      cy.visit('./tasks.html');
      cy.wait('@taskList');
      cy.wait('@workerList');
      cy.get('#job').type('main main').blur();
      cy.fixture('dino.png').then((fileContent) => {
        cy.get('input[type="file"]').attachFile({
          fileContent: fileContent.toString(),
          fileName: 'dino.png',
          mimeType: 'image/png',
        });
      });
      cy.get('#form').submit();
      cy.get('#list').children().as('taskList');
      cy.get('@taskList').should('have.length', 4);
      cy.get('@taskList').eq(3).should('contain.text', 'makan siang');
    });

    it('seharusnya setelah submit input ter reset', () => {
      cy.intercept('./add', { fixture: 'task' });
      cy.visit('./tasks.html');
      cy.wait('@taskList');
      cy.wait('@workerList');
      cy.get('#job').type('main main').blur();
      cy.fixture('dino.png').then((fileContent) => {
        cy.get('input[type="file"]').attachFile({
          fileContent: fileContent.toString(),
          fileName: 'dino.png',
          mimeType: 'image/png',
        });
      });
      cy.get('#form').submit();
      cy.get('#job').should('be.empty');
    });

    it('jika diklik attachment akan keluar gambarnya', () => {
      cy.intercept(
        {
          hostname: 'localhost:7002',
          pathname: '/attachment',
          method: 'GET',
        },
        {
          body: { fixture: 'dino.png' },
          statusCode: 200,
          headers: {
            'content-type': 'image/png',
          },
        }
      );
      cy.visit('./tasks.html');
      cy.wait('@taskList');
      cy.wait('@workerList');
      cy.get('#list').children().as('taskList');
      cy.get('@taskList').children().as('itemTask');
      cy.get('@itemTask').eq(0).click();
    });
  });

  describe('pekerjaan selesai', () => {
    beforeEach(() => {
      cy.intercept('GET', 'http://localhost:7001/list', {
        fixture: 'workerTask',
      }).as('workerList');
      cy.intercept('GET', 'http://localhost:7002/list', {
        fixture: 'tasks',
      }).as('taskList');
    });

    it('seharusnya pekerjaan menjadi selesai', () => {
      cy.intercept(
        {
          method: 'PUT',
          pathname: '/done',
          query: {
            id: '2',
          },
        },
        {
          body: {
            id: 2,
            job: 'belajar',
            assignee: { name: 'adit' },
            done: false,
          },
          statusCode: 200,
          headers: {
            'content-type': 'application/json',
          },
        }
      ).as('taskDone');
      cy.visit('/tasks.html');
      cy.wait('@taskList');
      cy.wait('@workerList');
      cy.get('#list').children().as('taskList');
      cy.get('@taskList').eq(1).should('not.contain.text', 'sudah selesai');
      cy.get('@taskList').eq(1).children().as('taskItem');
      cy.get('@taskItem').eq(4).click();
    });
  });

  describe('pekerjaan batal', () => {
    beforeEach(() => {
      cy.intercept('GET', 'http://localhost:7001/list', {
        fixture: 'workerTask',
      }).as('workerList');
      cy.intercept('GET', 'http://localhost:7002/list', {
        fixture: 'tasks',
      }).as('taskList');
    });

    it('seharusnya pekerjaan menjadi selesai', () => {
      cy.intercept(
        {
          method: 'PUT',
          pathname: '/cancel',
          query: {
            id: '3',
          },
        },
        {
          body: {
            id: 3,
            job: 'tidur',
            assignee: { name: 'budi' },
            done: false,
          },
          statusCode: 200,
          headers: {
            'content-type': 'application/json',
          },
        }
      ).as('taskCancel');
      cy.visit('/tasks.html');
      cy.wait('@taskList');
      cy.wait('@workerList');
      cy.get('#list').children().as('taskList');
      cy.get('@taskList').should('have.length', '3');
      cy.get('@taskList').eq(2).children().as('taskItem');
      cy.get('@taskItem').eq(3).click();
      cy.get('@taskList').should('have.length', '2');
    });
  });

  it.only('error jika request gagal', () => {
    cy.intercept('GET', 'http://localhost:7001/list', {
      statusCode: 500,
    }).as('taskFail');
    cy.intercept('GET', 'http://localhost:7002/list', {
      statusCode: 500,
    }).as('workerFail');
    cy.visit('/tasks.html');
    cy.wait('@taskFail');
    cy.wait('@workerFail');
    cy.get('#error-text').should(
      'contain.text',
      'gagal memuat daftar pekerjaan'
    );
  });
});
