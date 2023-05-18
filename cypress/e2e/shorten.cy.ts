describe('Shorten', () => {
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

  it('create shortened link', () => {
    cy.visit('/');

    cy.get('input[placeholder="Your URL"]').type('https://example.com');

    cy.contains('button', 'Shorten').click();

    cy.location('pathname').should('include', '/view/');

    cy.contains('div', 'Shortened').should('include.text', 'https://example.com');
    cy.contains('div', 'Shortened').should('include.text', 'Views:0');

    cy.contains('span', 'Slug:').find('+ span').invoke('text').as('slug');

    cy.get<string>('@slug').then((slug) => {
      cy.visit(`/${slug}`);
      cy.origin(`https://example.com`, () => {
        cy.location('href').should('equal', `https://example.com/`);
      });
    });
  });

  it('create shortened link with custom slug', () => {
    cy.visit('/');

    cy.get('input[placeholder="Your URL"]').type('https://example.com');
    cy.get('input[placeholder^="Custom slug"]').type('test-slug');

    cy.contains('button', 'Shorten').click();

    cy.location('pathname').should('include', '/view/test-slug');

    cy.contains('div', 'Shortened').should('include.text', 'https://example.com');
    cy.contains('div', 'Shortened').should('include.text', 'http://localhost/test-slug');
    cy.contains('div', 'Shortened').should('include.text', 'Slug:test-slug');
    cy.contains('div', 'Shortened').should('include.text', 'Views:0');

    cy.visit('/test-slug');
    cy.origin(`https://example.com`, () => {
      cy.location('href').should('equal', `https://example.com/`);
    });
  });

  it('create editable shortened link', () => {
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
  });
});
