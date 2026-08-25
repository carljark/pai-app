describe('Admin Dashboard', () => {
  beforeEach(() => {
    window.localStorage.setItem('pai_token', 'mock_token');

    // Mock admin user
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: { _id: 'admin1', name: 'Admin', role: 'admin', canUseAi: true }
    });

    // Mock users list
    cy.intercept('GET', '/api/admin/users', {
      statusCode: 200,
      body: [
        { _id: 'u1', name: 'Pendiente', email: 'p@test.com', role: 'pending', canUseAi: false }
      ]
    }).as('getUsers');

    // Mock permission update
    cy.intercept('PUT', '/api/admin/users/u1/permissions', {
      statusCode: 200,
      body: { _id: 'u1', name: 'Pendiente', email: 'p@test.com', role: 'teacher', canUseAi: true }
    }).as('updatePerms');

    cy.visit('/admin');
  });

  it('should approve user and grant AI access', () => {
    cy.wait('@getUsers');
    
    // The table should show the user
    cy.contains('p@test.com').should('be.visible');

    // Select role to Teacher
    cy.get('select').first().select('teacher');

    // Check AI Access box
    cy.get('input[type="checkbox"]').first().check();

    // Verify API called correctly
    cy.wait('@updatePerms').then((interception) => {
      expect(interception.request.body).to.deep.include({
        role: 'teacher',
        canUseAi: true
      });
    });
  });
});
