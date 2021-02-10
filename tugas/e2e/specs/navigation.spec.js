describe('halaman navigasi', () => {
  it('bisa buka halaman navigasi', () => {
    cy.visit('/');
  });

  describe('halaman pekerja', () => {
    it('bisa buka halaman pekerja', () => {
      cy.get('a[href*="worker.html"]').click();
    })
    it('endpoint halaman pekerja sesuai', () => {
      cy.location().should((loc) => expect(loc.href).to.eq('http://localhost:7000/worker.html'));
    })
  });

  describe('halaman pekerjaan', () => {
    it('bisa buka halaman pekerjaan', () => {
      cy.get('a[href*="tasks.html"]').click();
    });

    it('endpoint halaman pekerjaan sesuai', () => {
      cy.location().should((loc) => expect(loc.href).to.eq('http://localhost:7000/tasks.html'));
    })
  })

  describe('halaman kinerja', () => {
    it('bisa buka halaman kinerja', () => {
      cy.get('a[href*="performance.html"]').click();
    });
    it('endpoint halaman kinerja sesuai', () => {
      cy.location().should((loc) => expect(loc.href).to.eq('http://localhost:7000/performance.html'));
    })
  })
});
