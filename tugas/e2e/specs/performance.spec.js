describe('Performance Page', () => {
    it('seharusnya bisa membuka halaman performance', () => {
        cy.visit('/performance.html')
    });

    describe('Refresh Halaman', () => {
        it('seharusnya bisa tampilkan request summary', () => {
            cy.intercept('GET','http://localhost:7003/summary', {
                total_task: 0,
                task_done: 0,
                task_cancelled: 0,
                total_worker: 0, 
            }); 
        });
    });
});






