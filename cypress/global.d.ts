namespace Cypress {
  interface Chainable {
    assertValueCopiedToClipboard(value: string): Chainable<string>;
  }
}
