require('../../cypress/support/command');
describe('Worker Page', () => {
    it('Should can open worker page', () => {
        cy.visit('/worker.html')
    })

    describe('Show list worker', () => {
        it('Should show list worker', () => {
            cy.intercept('/list', { fixture: 'workers' }).as('getWorkerList')
            cy.intercept('/photo', { fixture: 'images/profile.jpeg' }).as(
                'getPhoto'
            )
            cy.visit('/worker.html')
            cy.get('#list').children().as('workerList')
            cy.get('@workerList').should('have.length', 3)

            cy.get('@workerList').eq(0).children().eq(1).as('Worker1')
            cy.get('@Worker1').should('contain.text', 'Budi')

            cy.get('@workerList').eq(1).children().eq(1).as('Worker2')
            cy.get('@Worker2').should('contain.text', 'Susi')

            cy.get('@workerList').eq(2).children().eq(1).as('Worker3')
            cy.get('@Worker3').should('contain.text', 'Ani')
        })

        it('Should show "gagal memuat daftar pekerja" ', () => {
            cy.visit('/worker.html')
            cy.get('#error-text').should(
                'contain.text',
                'gagal memuat daftar pekerja'
            )
        })
    })

    describe('Add new worker', () => {
        beforeEach(() => {
            cy.intercept('/list', { fixture: 'workers' })
            cy.intercept('/photo', { fixture: 'images/profile.jpeg' }).as(
                'getPhoto'
            )
            cy.visit('/worker.html')
        })

        it('Should success add new worker', () => {
            cy.intercept('/register', { fixture: 'worker' }).as(
                'addWorker'
            )

            cy.fixture('images/profile.jpeg').then(fileContent => {
                cy.get('input[type="file"]').attachFile({
                    fileContent: fileContent.toString(),
                    fileName: 'profile.jpeg',
                    mimeType: 'image/jpeg'
                });
            });

            cy.get('#name').type('adi');
            cy.get('#age').type('20');
            cy.get('#bio').type('traveling');
            cy.get('#address').type('Jakarta');
            cy.get('#form > button').click();
            
            cy.wait('@addWorker');

            cy.get('#list').children().as('workerList')
            cy.get('@workerList').should('have.length', 4)
            cy.get('#list').children().as('workerList');
            cy.get('@workerList').eq(3).children().as('workerNew');
            cy.get('@workerNew').eq(1).should('contain.text','adi');
        })

        it('Should error "form isian tidak lengkap!" ', () => {
            cy.get('#name').type('adi');
            cy.get('#age').type('20');
            cy.get('#bio').type('traveling');
            cy.get('#address').type('Jakarta');
            cy.get('#form > button').click();
            cy.get('#error-text').should('contain.text','form isian tidak lengkap!')
        })

        it('Should error "gagal mendaftarkan [name] " ', () => {
            cy.fixture('images/profile.jpeg').then(fileContent => {
                cy.get('input[type="file"]').attachFile({
                    fileContent: fileContent.toString(),
                    fileName: 'profile.jpeg',
                    mimeType: 'image/jpeg'
                });
            });
            cy.get('#name').type('adi');
            cy.get('#age').type('20');
            cy.get('#bio').type('traveling');
            cy.get('#address').type('Jakarta');
            cy.get('#form > button').click();
            cy.get('#error-text').should('contain.text','gagal mendaftarkan adi')
        })
    })

    describe('Remove worker', () => {
        beforeEach(() => {
            cy.intercept('/list', { fixture: 'workers' })
            cy.intercept('/photo', { fixture: 'images/profile.jpeg' }).as(
                'getPhoto'
            )
            cy.visit('/worker.html')
        })

        it('Should success remove worker', () => {
            cy.intercept('/remove', { fixture: 'worker' }).as(
                'removeWorker'
            )

            cy.get('#list').children().as('workerList')

            cy.get('@workerList').eq(0).children().eq(2).as('removeBtn');
            cy.get('@removeBtn').click();

            cy.wait('@removeWorker');
            cy.get('@workerList').should('have.length', 2);
        })

        it('Should error "gagal menghapus pekerja"', () => {
            cy.get('#list').children().as('workerList')

            cy.get('@workerList').eq(0).children().eq(2).as('removeBtn');
            cy.get('@removeBtn').click();

            cy.get('#error-text').should('contain.text','gagal menghapus pekerja')
        })
    })

    describe('Navigation test', () => {
        beforeEach(() => {
            cy.intercept('/list', { fixture: 'workers' })
            cy.intercept('/photo', { fixture: 'images/profile.jpeg' }).as(
                'getPhoto'
            )
            cy.visit('/worker.html')
        })

        it('Should visit worker', () => {
            cy.get(':nth-child(1) > a').click();
            cy.url().should('eq', 'http://localhost:7000/worker.html')
        });

        it('Should visit task', () => {
            cy.get(':nth-child(2) > a').click();
            cy.url().should('eq', 'http://localhost:7000/tasks.html')
        });

        it('Should visit performance', () => {
            cy.get(':nth-child(3) > a').click();
            cy.url().should('eq', 'http://localhost:7000/performance.html')
        });
    })
})
