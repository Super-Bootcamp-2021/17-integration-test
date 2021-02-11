/**
* Intercept the first matching request and send the response object.
* Do nothing on the second and other requests.
* @param {string} method HTTP method to intercept
* @param {string} url URL to intercept
* @param {any} response Response to send back on the first request
*/
const interceptOnce = (method, url, response) => {
  // I am using "count" to show how easy you can implement
  // different responses for different interceptors
  let count = 0
  return cy.intercept(method, url, req => {
    count += 1
    if (count < 2) {
      req.reply(response.send({ fixture: 'performance_summary.json' }))
    } else {
      req.reply(response.send({ fixture: 'performance_summaryR.json' }))
    }
  })
}

describe('Performance Page', () => {
  it('bisa buka halaman performance', () => {
    cy.visit('/');
  });

  describe('data summary', () => {
    beforeEach(() => {
      // ERROR Cause: Intercept Register too late
      // cy.visit();
      
      // // Ref: https://stackoverflow.com/questions/65044704/change-fixture-response-in-cypress-for-the-same-url-with-intercept
      // let interceptCount = 0;
      // cy.intercept('/summary', (req) => {
      //   req.reply(res => {
      //     if (interceptCount === 0 ) {
      //       interceptCount += 1;
      //       res.send({ fixture: 'performance_summary.json' })
      //     } else {
      //       res.send({ fixture: 'performance_summaryR.json' })
      //     }
      //   });
      // }).as(
      //   'getSummary'
      // );

      // cy.intercept('/summary', { fixture: 'performance_summary.json' }).as(
      //   'getSummary'
      // );

      // interceptOnce('/summary').as('getSummary')

      cy.intercept('/summary', req => {
        req.reply((res) => {
          let { body } = res;
          body.newProperty = "new";
          console.log('intercept', res.body);
          return body;
        });
      }).as(
        'getSummary'
      );

      cy.visit('/performance.html');
      cy.wait('@getSummary');
    });

    it.skip('seharusnya bisa menampilkan data summary', () => {
      cy.get('#workers').should('contain.text', '2');
      cy.get('#tasks').should('contain.text', '10');
      cy.get('#task-done').should('contain.text', '4');
      cy.get('#task-canceled').should('contain.text', '2');
    });

    it.skip('seharusnya bisa reload data summary', () => {
      cy.intercept('/summary', { fixture: 'performance_summaryR.json' })
      cy.get('#refresh').click();
      cy.reload();
      cy.wait('@getSummary');
      cy.get('#workers').should('contain.text', '4');
      cy.get('#tasks').should('contain.text', '14');
      cy.get('#task-done').should('contain.text', '8');
      cy.get('#task-canceled').should('contain.text', '6');
    });
  });
});
