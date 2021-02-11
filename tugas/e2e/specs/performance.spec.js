describe('Performance Page', () => {
    it('bisa buka halaman performance', () => {
        cy.visit('/performance.html');
    });

    describe('total workers', () => {
        it('seharusnya bisa menampilkan total worker', () => {
            cy.intercept(
                {
                    pathname: '/summary',
                    method: 'GET',
                },
                {fixture:'performance'}).as('getPerformance')
            cy.visit('/performance.html');
            cy.get('#workers').as('totalWorker')
            cy.get('@totalWorker').should('contain.text', '2')
        })
    });

    describe('total tasks', () => {
        it('seharusnya bisa menampilkan total task', () => {
            cy.intercept(
                {
                    pathname: '/summary',
                    method: 'GET',
                },
                {fixture:'performance'}).as('getPerformance')
            cy.visit('/performance.html');
            cy.get('#tasks').as('totalTask')
            cy.get('@totalTask').should('contain.text', '5')
        })
    });

    describe('total done tasks', () => {
        it('seharusnya bisa menampilkan total task selesai', () => {
            cy.intercept(
                {
                    pathname: '/summary',
                    method: 'GET',
                },
                {fixture:'performance'}).as('getPerformance')
            cy.visit('/performance.html');
            cy.get('#task-done').as('taskDone')
            cy.get('@taskDone').should('contain.text', '3')
        })
    });

    describe('total cancelled tasks', () => {
        it('seharusnya bisa menampilkan total task dibatalkan', () => {
            cy.intercept(
                {
                    pathname: '/summary',
                    method: 'GET',
                },
                {fixture:'performance'}).as('getPerformance')
            cy.visit('/performance.html');
            cy.get('#task-canceled').as('taskCancel')
            cy.get('@taskCancel').should('contain.text', '2')
        })
    });

    describe('Error message', () => {
        it('seharusnya menampilkan error', () => {
            cy.intercept('/summary',{}).as('getPerformance')
            cy.visit('/performance.html');
            cy.wait('@getPerformance');
            cy.get('#error-text').as('errorMessage')
            cy.get('@errorMessage').should('contain.text', 'gagal memuat informasi kinerja')
        })
    });

    describe('Loading message', () => {
        it('seharusnya menampilkan pesan memuat', () => {
            cy.intercept('/summary',{}).as('getPerformance')
            cy.visit('/performance.html');
            cy.get('#loading-text').as('loadingMessage')
            cy.get('@loadingMessage').should('contain.text', 'memuat...')
        })
        it('seharusnya menampilkan pesan memuat ketika tekan tombol refresh', () => {
            cy.intercept('/summary',{}).as('getPerformance');
            cy.visit('/performance.html');
            cy.get('#refresh').click();
            cy.get('#loading-text').as('loadingMessage')
            cy.get('@loadingMessage').should('contain.text', 'memuat...')

        })
    });

    describe('Navigations', () => {
        it('seharusnya bisa berpindah ke halaman worker', () => {
            cy.get(':nth-child(1) > a').click()
            cy.url().should('include', '/worker.html')
            cy.url().should('eq', 'http://localhost:7000/worker.html')
        })
        it('seharusnya bisa berpindah ke halaman task', () => {
            cy.get(':nth-child(2) > a').click()
            cy.url().should('include', '/tasks.html')
            cy.url().should('eq', 'http://localhost:7000/tasks.html')
        })
        it('seharusnya bisa berpindah ke halaman kinerja', () => {
            cy.get(':nth-child(3) > a').click()
            cy.url().should('include', '/performance.html')
            cy.url().should('eq', 'http://localhost:7000/performance.html')
        })
    })
})