describe('Task page', () => {
  it('bisa buka halaman Task', () => {
    cy.intercept('http://localhost:7002/list', { fixture: 'tasks' }).as(
      'gettasklist'
    );
    cy.intercept('http://localhost:7001/list', { fixture: 'workers' }).as(
      'getworkerlist'
    );
    cy.visit('/tugas/www/tasks.html');
  });
  describe('tambah task', () => {
    beforeEach(() => {
      cy.intercept('http://localhost:7002/list', { fixture: 'tasks' }).as(
        'gettasklist'
      );
      cy.intercept('http://localhost:7001/list', { fixture: 'workers' }).as(
        'getworkerlist'
      );
    });
    it('seharusnya bisa ngeload task list', () => {
      cy.visit('/tugas/www/tasks.html');
      cy.wait('@gettasklist');
      cy.wait('@getworkerlist');
      cy.get('#list').children().as('taskList');
      cy.get('@taskList').should('have.length', 2);
    });
    it('seharusnya keluar pesan error', () => {
      cy.visit('/tugas/www/tasks.html');
      cy.wait('@gettasklist');
      cy.wait('@getworkerlist');
      cy.get('#form > button').click();
      cy.get('#error-text').should('have.text', 'form isian tidak lengkap!');
    });
    it('seharusnya ketika di submit item bertambah', () => {
      cy.intercept('http://localhost:7002/add', { fixture: 'task' }).as(
        'addTask'
      );
      cy.visit('/tugas/www/tasks.html');
      cy.wait('@gettasklist');
      cy.wait('@getworkerlist');
      cy.get('#job').type('tidur');
      cy.get('#assignee').select('susanti');
      cy.fixture('gambar/fullstack.jpg').then((fileContent) => {
        cy.get('input[type="file"]').attachFile({
          fileContent: fileContent.toString(),
          fileName: 'testPicture.jpg',
          mimeType: 'image/jpg',
        });
      });
      cy.get('#form > button').click();

      cy.wait('@addTask');
      cy.get('#list').children().as('taskList');
      cy.get('@taskList').should('have.length', 3);
    });
  });
  describe('cancel task', () => {
    beforeEach(() => {
      cy.intercept('http://localhost:7002/list', { fixture: 'tasks' }).as(
        'gettasklist'
      );
      cy.intercept('http://localhost:7001/list', { fixture: 'workers' }).as(
        'getworkerlist'
      );
    });
    it('harusnya bisa di cancel', () => {
      cy.intercept('http://localhost:7002/cancel?id=1', {
        fixture: 'taskid1',
      }).as('kembalian');
      cy.visit('/tugas/www/tasks.html');
      cy.wait('@gettasklist');
      cy.wait('@getworkerlist');
      cy.get('#list > :nth-child(1) > :nth-child(4)').as('buttonklik');
      cy.get('@buttonklik').click();
      cy.wait('@kembalian');
      cy.get('#list').children().should('have.length', 1);
    });
  });
  describe('done task', () => {
    beforeEach(() => {
      cy.intercept('http://localhost:7002/list', { fixture: 'tasks' }).as(
        'gettasklist'
      );
      cy.intercept('http://localhost:7001/list', { fixture: 'workers' }).as(
        'getworkerlist'
      );
    });
    it('harusnya bisa di done', () => {
      cy.intercept('http://localhost:7002/done?id=1', {
        fixture: 'taskid1',
      }).as('kembalian');
      cy.visit('/tugas/www/tasks.html');
      cy.wait('@gettasklist');
      cy.wait('@getworkerlist');
      cy.get('#list > :nth-child(1) > :nth-child(5)').as('buttonklik');
      cy.get('@buttonklik').click();
      cy.wait('@kembalian');
      cy.get('#list > :nth-child(1)').children().as('listpertama');
      cy.get('@listpertama').should('have.length', 4);
      cy.get('@listpertama').eq(3).should('have.text', 'sudah selesai');
    });
  });
});
