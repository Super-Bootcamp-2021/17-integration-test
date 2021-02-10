describe('performance Page', () => {
  it('bisa buka halaman performance', () => {
    cy.visit('/performance.html');
  });

  describe('daftar Performance', () => {
    it('seharusnya bisa menampilkan performance pekerja', () => {
      cy.intercept(
        {
          pathname: '/summary',
          method: 'GET',
        },
        {
          body: {
            total_task: 37,
            task_done: 77,
            task_cancelled: 75,
            total_worker: 71,
          },
          statusCode: 200,
          headers: {
            'content-type': 'application/json',
          },
        }
      ).as('getList');
      cy.visit('/performance.html');
      cy.wait('@getList');
      cy.get('#workers').should('contain.text', '71');
      cy.get('#tasks').should('contain.text', '37');
      cy.get('#task-done').should('contain.text', '77');
      cy.get('#task-canceled').should('contain.text', '75');
    });

    it('Ketika error bisa menampilkan warning', () => {
      cy.intercept(
        {
          pathname: '/summary',
          method: 'GET',
        },
        {
          statusCode: 400,
          headers: {
            'content-type': 'application/json',
          },
        }
      ).as('getList');
      cy.visit('/performance.html');
      cy.wait('@getList');
      cy.get('#error-text').should(
        'contain.text',
        'gagal memuat informasi kinerja'
      );
    });

    it('seharusnya bisa merefres halamanan performance tugas', () => {
      cy.intercept(
        {
          pathname: '/summary',
          method: 'GET',
        },
        {
          body: {
            total_task: 37,
            task_done: 77,
            task_cancelled: 75,
            total_worker: 71,
          },
          statusCode: 200,
          headers: {
            'content-type': 'application/json',
          },
        }
      ).as('getList');
      cy.visit('/performance.html');
      cy.wait('@getList');
      cy.get('#refresh').click();
      cy.get('#workers').should('contain.text', '71');
      cy.get('#tasks').should('contain.text', '37');
      cy.get('#task-done').should('contain.text', '77');
      cy.get('#task-canceled').should('contain.text', '75');
    });
  });
});
