describe('User Profile', () => {
  it('Visits the user profile', () => {
    cy.visit('/#/user-profile')
    cy.get('h4.title')
      .should('be.visible')
      .should('contain', 'Your Profile')
    // TODO: offline mode for UserService
    // cy.get('input#username')
    //   .should('be.visible')
    //   .should('be.disabled')
  })
})
