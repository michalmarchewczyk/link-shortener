describe('Edit', () => {
  before(() => {
    cy.wrap(
      Cypress.automation('remote:debugger:protocol', {
        command: 'Browser.grantPermissions',
        params: {
          permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
          origin: window.location.origin,
        },
      }),
    );
  });

  it('edit shortened link', () => {
    cy.visit('/');
    cy.get('input[placeholder="Your URL"]').type('https://www.example.com');
    cy.contains('label', 'Editable').click();
    cy.contains('button', 'Shorten').click();

    cy.location('pathname').should('equal', '/');
    cy.contains('div', 'Link created').should('exist');
    cy.contains('div', 'Link created').should('include.text', 'Edit token');

    cy.get('code').invoke('text').invoke('slice', 0, 32).as('editToken');
    cy.get('code').find('button').click();
    cy.get<string>('@editToken').then((editToken) => {
      cy.assertValueCopiedToClipboard(editToken);
    });
    cy.contains('a', 'Preview link').click();

    cy.location('pathname').should('include', '/view/');
    cy.contains('div', 'Shortened').should('include.text', 'https://www.example.com');
    cy.contains('div', 'Shortened').should('include.text', 'Views:0');
    cy.contains('span', 'Slug:').find('+ span').invoke('text').as('slug');

    cy.get<string>('@slug').then((slug) => {
      cy.visit('/edit');
      cy.get('input[placeholder="Slug"]').type(slug);
    });
    cy.get('input[placeholder="Edit token"]').paste();
    cy.get('input[placeholder="New URL"]').type('https://google.com');
    cy.contains('button', 'Save').click();

    cy.location('pathname').should('equal', '/edit');
    cy.contains('div', 'Link edited').should('exist');
    cy.contains('a', 'Preview link').click();

    cy.location('pathname').should('include', '/view/');
    cy.contains('div', 'Shortened').should('include.text', 'https://google.com');
    cy.contains('div', 'Shortened').should('include.text', 'Views:0');
  });
});
