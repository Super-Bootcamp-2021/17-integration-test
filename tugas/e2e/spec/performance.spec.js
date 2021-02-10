describe('Performance Page', () => {
  it('Bisa buka halaman peformance', () => {
    cy.visit('/performance.html');
    cy.get('ul')
      .children()
      .eq(0)
      .children()
      .should('have.attr', 'href', 'worker.html');
    cy.get('ul')
      .children()
      .eq(1)
      .children()
      .should('have.attr', 'href', 'tasks.html');
    cy.get('ul')
      .children()
      .eq(2)
      .children()
      .should('have.attr', 'href', 'performance.html');
  });

  it(
    'Seharusnya menampilkan loading ketika sedang memuat data dari server',
    { defaultCommandTimeout: 4000 },
    () => {
      cy.intercept(
        {
          pathname: '/summary',
          method: 'GET',
        },
        {
          body: {
            total_task: 3,
            task_done: 1,
            task_cancelled: 2,
            total_worker: 5,
          },
          statusCode: 200,
          headers: {
            'content-type': 'application/json',
          },
        }
      ).as('getSummary');
      cy.visit('/performance.html');
      cy.wait('@getSummary');
      cy.get('#loading-text').should('have.text', 'memuat...');
    }
  );

  it('Seharusnya bisa menampilkan item pekerja dan pekerjaan', () => {
    cy.intercept('/summary', { fixture: 'listPerformance.json' }).as(
      'getSummary'
    );
    cy.visit('/performance.html');
    cy.wait('@getSummary');
    cy.get('#workers').should('have.text', '4');
    cy.get('#tasks').should('have.text', '2');
    cy.get('#task-done').should('have.text', '1');
    cy.get('#task-canceled').should('have.text', '0');
  });

  it('Seharusnya update ketika tombol refresh ditekan dan data sudah berubah', () => {
    cy.intercept(
      {
        pathname: '/summary',
        method: 'GET',
      },
      {
        body: {
          total_task: 3,
          task_done: 1,
          task_cancelled: 2,
          total_worker: 5,
        },
        statusCode: 200,
        headers: {
          'content-type': 'application/json',
        },
      }
    ).as('getSummary2');
    cy.visit('/performance.html');
    cy.wait('@getSummary2');
    cy.get('#refresh').click();
    cy.get('#workers').should('have.text', '5');
    cy.get('#tasks').should('have.text', '3');
    cy.get('#task-done').should('have.text', '1');
    cy.get('#task-canceled').should('have.text', '2');
  });

  it('Seharusnya error ketika server mati atau error', () => {
    cy.intercept(
      {
        pathname: '/summary',
        method: 'GET',
      },
      {
        body: {
          total_task: 5,
          task_done: 1,
          task_cancelled: 2,
          total_worker: 5,
        },
        statusCode: 500,
        headers: {
          'content-type': 'application/json',
        },
      }
    ).as('getSummary');
    cy.visit('/performance.html');
    cy.wait('@getSummary');
    cy.get('#error-text').should('have.text', 'gagal memuat informasi kinerja');
  });
});
