describe('performance page', () =>{
    it('can open performance page', () => {
        cy.visit('/');
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
            //cy.visit('/');


            cy.intercept('get','/summary', {fixture: 'performance'}) 
        
            cy.get('#tasks').should('contain.text', '5');
            cy.get('#task-done').should('contain.text', '2');
            cy.get('#task-canceled').should('contain.text', '8');
            cy.get('#workers').should('contain.text', '6');
        })
    })
})