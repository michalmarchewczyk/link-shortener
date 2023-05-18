describe('Preview', () => {
  it('automatically preview shortened link', () => {
    cy.visit('/');
    cy.get('input[placeholder="Your URL"]').type('https://example.com');
    cy.contains('button', 'Shorten').click();

    cy.location('pathname').should('include', '/view/');
    cy.contains('div', 'Shortened').should('include.text', 'URL:https://example.com');
    cy.contains('div', 'Shortened').should('include.text', 'Slug:');
    cy.contains('div', 'Shortened').should('include.text', 'Views:0');
    cy.contains('div', 'Shortened').should('include.text', 'Created:');
    cy.contains('div', 'Shortened').should('include.text', 'Last update:');

    cy.contains('button', 'Go back').click();
    cy.location('pathname').should('equal', '/view');
  });

  it('preview link by slug', () => {
    cy.visit('/');
    cy.get('input[placeholder="Your URL"]').type('https://example.com');
    cy.get('input[placeholder^="Custom slug"]').type('test-preview-slug');
    cy.contains('button', 'Shorten').click();

    cy.visit('/view');
    cy.get('input[placeholder="Slug"]').type('test-preview-slug');
    cy.contains('button', 'View').click();

    cy.location('pathname').should('include', '/view/test-preview-slug');
    cy.contains('div', 'Shortened').should('include.text', 'URL:https://example.com');
    cy.contains('div', 'Shortened').should('include.text', 'Slug:test-preview-slug');
    cy.contains('div', 'Shortened').should('include.text', 'Views:0');

    cy.contains('button', 'Go back').click();
    cy.location('pathname').should('equal', '/view');
  });

  it('validate slug', () => {
    cy.visit('/view');

    [' ', 'test slug', '-test-slug', 'test-slug-', 'ąęóżść', '@#$#$', 'aa'].forEach((slug) => {
      cy.get('input[placeholder^="Slug"]').clear();
      cy.get('input[placeholder^="Slug"]').type(slug);
      cy.get('input[placeholder^="Slug"]').blur();
      cy.contains('button', 'View').should('be.disabled');
      cy.contains('div', 'Invalid slug').should('exist');
    });
    cy.get('input[placeholder^="Slug"]').clear();
    cy.get('input[placeholder^="Slug"]').type('test-slug');
    cy.contains('button', 'View').should('not.be.disabled');
    cy.contains('div', 'Invalid slug').should('not.exist');
  });
});
