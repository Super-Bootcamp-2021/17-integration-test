describe('Performance Page', () => {
    it('seharusnya bisa membuka halaman performance', () => {
        cy.visit('/performance.html');
    });

    describe('Refresh Page', () => {
        it('seharusnya bisa me-refresh halaman', () => {
            cy.intercept('GET','http://localhost:7003/summary', {
                total_worker: 20,
                total_task: 10,
                task_done: 7,
                task_cancelled: 3,        
            }); 
            cy.visit('/performance.html');
            cy.get('#refresh').click();
            cy.get('ul').last().as('jumlahPekerja');
            cy.get('@jumlahPekerja').children().eq(0).should('contain.text', '20')
            cy.get('@jumlahPekerja').children().eq(1).should('contain.text', '10')
            cy.get('@jumlahPekerja').children().eq(2).should('contain.text', '7')
            cy.get('@jumlahPekerja').children().eq(3).should('contain.text', '3')
        }) 
    });
});







