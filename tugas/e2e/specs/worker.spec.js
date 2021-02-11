/* eslint-disable prettier/prettier */
describe('Page - Worker load', () => {
    it('buka halaman worker', () => {
        cy.visit('/worker.html');
    });

    describe('Change Test', () => {
        beforeEach(() => {
            cy.get('[type="text"]').clear()
            cy.get('textarea').clear()
        });

        it("Change input test name", () => {
            cy.get('input#name').type('Joshua');
            cy.get('input#name').should('have.value', 'Joshua');
            cy.get('input#name').should(($input) => {
                const val = $input.val();

                expect(val).to.match(/Joshua/);
                expect(val).to.include('Joshua');
                expect(val).not.to.include('Budi');
            });
        });

        it("Change input test age", () => {
            cy.get('input#age').type('20');
            cy.get('input#age').should('have.value', '20');
        });
        it("Change input test bio", () => {
            cy.get('textarea#bio').type('Suka makan ayam');
            cy.get('textarea#bio').should('have.value', 'Suka makan ayam');
        });
        it("Change input tes name", () => {
            cy.get('textarea#address').type('Jl. suka suka');
            cy.get('textarea#address').should('have.value', 'Jl. suka suka');
        });
    })

    describe('add worker', () => {
        beforeEach(() => {
            cy.intercept('GET', 'http://localhost:7001/list', {
                fixture: 'workerTask',
            }).as('getWorker');
        });

        it.only('should add new worker', () => {
            cy.intercept('/add', {
                id: 1,
                name: 'joshua',
                age: 20,
                photo: '///',
                bio: 'suka makan ayam',
                address: 'Jl.ku',
            });
            cy.visit('/worker.html');
            cy.wait('@getWorker');
            cy.get('input#worker-form').type('Yuhuu');
            cy.get('#worker-form').submit();
            cy.get('#list-worker').children().as('workerList');
            cy.get('@workerList').should('have.length', 1);
            cy.get('@workerList').eq(0).should('contain.text', 'Yuhuu');
            cy.get('@workerList').eq(0).should('not.have.class', 'worker-error');
        });

        it('seharusnya ketika di submit form di reset', () => {
            cy.intercept('/add', {
                id: 1,
                name: 'joshua',
                age: 20,
                photo: '///',
                bio: 'suka makan ayam',
                address: 'Jl.ku',
            });
            cy.visit('/');
            cy.wait('@getWorker');
            cy.get('input#worker-form').type('makan ayam');
            cy.get('#worker-form').submit();
            cy.get('input#worker-form').should('be.empty');
        });
    });

    describe('worker list', () => {
        it('Should display worker list', () => {
            cy.intercept({
                pathname: '/list',
                method: 'GET',
            }, {
                body: [{
                        id: 1,
                        name: 'joshua',
                        age: '30',
                        photo: '////',
                        bio: 'Lahir di mana saja',
                        address: 'Jl. Ninjaku',
                        loading: false,
                        error: false,
                    },
                    {
                        id: 1,
                        name: 'shinchan',
                        age: '20',
                        photo: '////',
                        bio: 'Periode 1',
                        address: 'Jl. jalan',
                        loading: false,
                        error: false,
                    },
                ],
                statusCode: 200,
                headers: {
                    'content-type': 'application/json',
                },
            }).as('getWorkerList');
            cy.visit('/');
            cy.wait('@getWorkerList');
            cy.get('#worker-list').children().as('workerList');
            cy.get('@workerList').should('have.length', 2);
            cy.get('@v').eq(0).should('contain.text', 'joshua');
            cy.get('@workerList').eq(1).should('contain.text', 'shinchan');
        });
    });
});