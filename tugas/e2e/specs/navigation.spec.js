describe('Home page', () => {
  it('bisa buka halaman navigasi', () => {
    cy.visit('/');
  });

  it('bisa buka halaman pekerja', () => {
    cy.get('a[href*="worker.html"]').click();
  });

  it('bisa buka halaman pekerjaan', () => {
    cy.get('a[href*="tasks.html"]').click();
  });

  it('bisa buka halaman kinerja', () => {
    cy.get('a[href*="performance.html"]').click();
  });
});
