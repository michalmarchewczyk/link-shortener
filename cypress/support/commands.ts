Cypress.Commands.add('assertValueCopiedToClipboard', (value) => {
  cy.window().then((win) => {
    win.navigator.clipboard.readText().then((text) => {
      expect(text).to.eq(value);
    });
  });
});

Cypress.Commands.add('paste', { prevSubject: true }, (subject) => {
  cy.wrap(
    new Promise((resolve) => {
      cy.window().then((win) => {
        win.navigator.clipboard.readText().then((text) => {
          resolve(text);
        });
      });
    }),
  ).then((val: string) => {
    cy.wrap(subject).type(val);
  });
});
