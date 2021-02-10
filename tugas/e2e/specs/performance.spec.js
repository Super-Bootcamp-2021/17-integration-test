describe('Performance Page', () => {
    it('seharusnya bisa membuka halaman performance', () => {
        cy.visit('/performance.html')
    });

    describe('Tampilkan summary', () => {
        it('seharusnya bisa tampilkan request summary', () => {
            cy.intercept('GET','http://localhost:7003/summary', {
                total_task: 0,
                task_done: 0,
                task_cancelled: 0,
                total_worker: 0,        
            }); 
            cy.get('#refresh').click().should({
                total_task: 20,
                task_done: 12,
                task_cancelled: 2,
                total_worker: 23,  
            }) 
        });
    });
});






