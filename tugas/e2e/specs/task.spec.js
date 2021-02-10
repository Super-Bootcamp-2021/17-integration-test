import 'cypress-file-upload';

describe('Halaman  Tasks', () => {
  it('bisa buka halaman tasks', () => {    
    cy.visit('/tasks.html')
    cy.get('body').should('contains.text', 'memuat')  
  });
  
  beforeEach(() => {
    cy.intercept('GET','localhost:7001/list',{ fixture: 'workers' }).as('workerlist');
    cy.intercept('GET','localhost:7002/list', { fixture: 'tasks' }).as('tasklist');
  })
  describe('mendapatkan list pekerjaan', () => {    
    it('bisa mendapatkan informasi pegawai dan pekerjaannya ', () => {
      cy.visit('/tasks.html')
      cy.wait('@tasklist'); 
      cy.wait('@workerlist'); 
      cy.get('#list').children().as('task')
      cy.get('@task').eq(0).should('contain.text', 'ngoding')
      cy.get('@task').eq(1).should('contain.text', 'membaca')
      cy.get('@task').eq(2).should('contain.text', 'mencuci baju')
      cy.get('@task').eq(3).should('contain.text', 'merapikan meja')
      cy.get('#assignee').children().as('assignee')
      cy.get('@assignee').eq(0).should('have.text', 'yudi asrama')
      cy.get('@assignee').eq(1).should('have.text', 'yudi sutrisno')
      cy.get('@assignee').eq(2).should('have.text', 'yudi santoso')
    });
    describe('mengubah status pekerjaan', () => {
      it('harusnya bisa ngilang', () => {
        cy.intercept('PUT', 'localhost:7002/cancel?id=1',
            {
              "id": 1,
              "job": "ngoding",
              "done": false,
              "cancelled": true,
              "addedAt": "2021-02-04T17: 01: 32.000Z",
              "attachment": "doc.doc",
              "assignee": {
                "id": 3,
                "name": "yudi santoso",
                "age": 15,
                "bio": "yudi merupakan pekerja yang sangat antusias dalam mengoding program",
                "address": "BTN Graha Permai, Jakarta Utara",
                "photo": "foto1.png"
              }
            }
            );
          cy.visit('/tasks.html')
          cy.get('#list').children().as('task')
          cy.get('@task').eq(0).contains('batal').click()
          cy.get('@task').should('have.length', 3)
      })
      it('harusnya bisa selesai', () => {
        cy.intercept('PUT', 'localhost:7002/done?id=2',
        {
          "id": 2,
          "job": "membaca",
          "done": false,
          "cancelled": false,
          "addedAt": "2021-02-04T18: 01: 32.000Z",
          "attachment": "doc.doc",
          "assignee": {
            "id": 3,
            "name": "yudi santoso",
            "age": 15,
            "bio": "yudi merupakan pekerja yang sangat antusias dalam mengoding program",
            "address": "BTN Graha Permai, Jakarta Utara",
            "photo": "foto1.png"
          }
        }
            );
          cy.visit('/tasks.html')
          cy.get('#list').children().as('task')
          cy.get('@task').eq(1).contains('selesai').click()
          cy.get('@task').should('not.have.text', 'selesai' )
          cy.get('@task').should('have.length', 4)
      })
    })
  });
  describe('menambahkan pekerjaan', () => {
    it('harusnya bisa nambah', () => {
    cy.intercept('POST', 'localhost:7002/add', { fixture : 'task'})
    cy.visit('/tasks.html')
    cy.wait('@tasklist'); 
    cy.wait('@workerlist');
    cy.get("#form > textarea").type('mancing perkara')      
    cy.get("#form > select").select('yudi asrama')
    cy.get("#attachment").click().attachFile('saya.doc')
    cy.get("#form").submit()
    cy.get("#list").should('have.length', 1)
    cy.get('#list').should('contain.text', 'mancing perkara')
    })
  }) 
});
