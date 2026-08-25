describe('Project Generation', () => {
  beforeEach(() => {
    // Mock user login so frontend thinks we are authenticated and can use AI
    window.localStorage.setItem('pai_token', 'mock_token');
    
    // Mock the settings request
    cy.intercept('GET', '/api/settings', {
      statusCode: 200,
      body: { schoolName: 'Centro Test', schoolCity: 'Madrid', schoolContext: 'Context' }
    });

    // Mock the user info
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: { _id: '123', name: 'Test User', role: 'teacher', canUseAi: true }
    });

    // Intercept project generation
    cy.intercept('POST', '/api/projects/generate', {
      statusCode: 200,
      body: { 
        _id: 'proj1', 
        title: 'Mi Super Proyecto', 
        generatedContent: { rawText: '# Proyecto de Prueba' },
        createdAt: new Date().toISOString()
      }
    }).as('generateProject');

    cy.visit('/');
  });

  it('should generate a project successfully', () => {
    // Select standard values from the app UI
    cy.get('select[name="familia"]').select('Informática y Comunicaciones');
    // We assume the UI updates the cycle select
    cy.get('select[name="ciclo"]').select('Desarrollo de Aplicaciones Web');
    
    // Type project name
    cy.get('input[name="title"]').type('Mi Super Proyecto');
    
    // Click Generate button
    cy.get('button').contains(/Generar|Genera/).click();

    // Verify the API was called with the right data
    cy.wait('@generateProject').its('request.body').should('include', {
      title: 'Mi Super Proyecto'
    });

    // Verify UI shows the generated text (it redirects to editor or shows it)
    cy.contains('Proyecto de Prueba').should('be.visible');
  });
});
