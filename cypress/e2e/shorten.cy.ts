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

  it('prevent creating shortened link with existing slug', () => {
    cy.visit('/');
    cy.get('input[placeholder="Your URL"]').type('https://example.com');
    cy.get('input[placeholder^="Custom slug"]').type('test-existing-slug');
    cy.contains('button', 'Shorten').click();

    cy.visit('/');
    cy.get('input[placeholder="Your URL"]').type('https://google.com');
    cy.get('input[placeholder^="Custom slug"]').type('test-existing-slug');
    cy.contains('button', 'Shorten').click();

    cy.contains('div', 'Slug already exists').should('exist');
    cy.location('pathname').should('equal', '/');
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

  it('validate url and slug', () => {
    cy.visit('/');

    [' ', 'example', 'example .com', 'ssh://example.com'].forEach((url) => {
      cy.get('input[placeholder="Your URL"]').clear();
      cy.get('input[placeholder="Your URL"]').type(url);
      cy.get('input[placeholder="Your URL"]').blur();
      cy.contains('button', 'Shorten').should('be.disabled');
      cy.contains('div', 'Invalid URL').should('exist');
    });
    cy.get('input[placeholder="Your URL"]').clear();
    cy.get('input[placeholder="Your URL"]').type('https://example.com');
    cy.contains('button', 'Shorten').should('not.be.disabled');
    cy.contains('div', 'Invalid URL').should('not.exist');

    ['test slug', '-test-slug', 'test-slug-', 'ąęóżść', '@#$#$', 'aa'].forEach((slug) => {
      cy.get('input[placeholder^="Custom slug"]').clear();
      cy.get('input[placeholder^="Custom slug"]').type(slug);
      cy.get('input[placeholder^="Custom slug"]').blur();
      cy.contains('button', 'Shorten').should('be.disabled');
      cy.contains('div', 'Invalid slug').should('exist');
    });
    cy.get('input[placeholder^="Custom slug"]').clear();
    cy.get('input[placeholder^="Custom slug"]').type('test-slug');
    cy.contains('button', 'Shorten').should('not.be.disabled');
    cy.contains('div', 'Invalid slug').should('not.exist');
  });
});
