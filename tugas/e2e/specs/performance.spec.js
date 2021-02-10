describe('performance page', () =>{
    it('can open performance page', () => {
        cy.visit('/');
        cy.get('#menuPerformance').click();
    })

    describe('performance list', () => {
        it('seharusnya bisa menampilkan summary of performance', () => {
            
            cy.intercept(
                {method: 'GET', pathname: '/summary', 
                }, 
                {body: { total_task : 5, task_done : 2, task_cancelled : 8, total_worker : 6 },
                statusCode: 200,
                headers: {
                    'content-type': 'application/json',
                }, 
                },  
            );
            cy.visit('/');
            cy.get('#menuPerformance').click();
            cy.get('#tasks').should('contain.text', '5');
            cy.get('#task-done').should('contain.text', '2');
            cy.get('#task-canceled').should('contain.text', '8');
            cy.get('#workers').should('contain.text', '6');
        })

        it('seharusnya bisa menampilkan summary of performance lagi', () => {
            cy.get('#refresh').click();
            
            cy.intercept('get','/summary', {fixture: 'performance'}) 
        
            cy.get('#tasks').should('contain.text', '5');
            cy.get('#task-done').should('contain.text', '2');
            cy.get('#task-canceled').should('contain.text', '8');
            cy.get('#workers').should('contain.text', '6');
        })

        it('seharusnya bisa menampilkan summary of performance lagi ketika button refresh diklik', () => {
  
            cy.intercept('get','/summary', {fixture: 'performance'}) 
        
            cy.get('#tasks').should('contain.text', '5');
            cy.get('#task-done').should('contain.text', '2');
            cy.get('#task-canceled').should('contain.text', '8');
            cy.get('#workers').should('contain.text', '6');
        })

    })

    describe('loading and error message', () => {
        it('seharusnya bisa menampilkan loading ketika sedang load data', () => {
           cy.visit('/');
           cy.get('#menuPerformance').click();  
            cy.get('#tasks').should('contain.text', '0');
            cy.get('#task-done').should('contain.text', '0');
            cy.get('#task-canceled').should('contain.text', '0');
            cy.get('#workers').should('contain.text', '0');
            cy.get('#loading-text').should('contain.text', 'memuat...');
        })
        it('seharusnya bisa menampilkan error ketika gagal load data', () => {
           cy.visit('/');
           cy.get('#menuPerformance').click();  
            cy.intercept(
                {method: 'GET', pathname: '/summary', 
                }, 
                {body: { total_task : 5, task_done : 2, task_cancelled : 8, total_worker : 6 },statusCode: 404,
                headers: {
                    'content-type': 'application/json',
                }, 
                },  
            );
            cy.get('#tasks').should('contain.text', '0');
            cy.get('#task-done').should('contain.text', '0');
            cy.get('#task-canceled').should('contain.text', '0');
            cy.get('#workers').should('contain.text', '0');
            cy.get('#error-text').should('contain.text', 'gagal memuat informasi kinerja');
        })
    })  
})