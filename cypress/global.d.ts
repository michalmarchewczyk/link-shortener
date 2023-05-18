namespace Cypress {
  interface Chainable {
    assertValueCopiedToClipboard(value: string): Chainable<string>;
    paste(): Chainable<JQuery<HTMLInputElement>>;
  }
}
