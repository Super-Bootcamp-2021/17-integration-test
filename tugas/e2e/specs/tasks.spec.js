describe('halaman pekerjaan', () => {
  it('bisa membuka halaman pekerjaan', () => {
    cy.visit('/tasks.html');
  });

  it('seharusnya menampilkan data pekerja', () => {
    cy.intercept('/list', { fixture: 'tasks' }).as('taskList');
    cy.visit('/tasks.html');
    cy.wait('@taskList');
  });

//   it('seharusnya selesai pekerjaan mencuci', () => {
//     cy.intercept('PUT', '/done', {fixture: 'task-done'}).as('doneTask');
//     cy.visit('/tasks.html');
//     cy.wait('@doneTask')
//   });
});
