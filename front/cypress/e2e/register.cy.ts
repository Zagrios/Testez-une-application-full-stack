/// <reference types="cypress" />

export function run(){

    describe('Register spec', () => {
    
        it('Should register successfull', () => {
    
            cy.visit('/register')
      
            cy.intercept('POST', '/api/auth/register', {status: 200});
      
            cy.get('input[formControlName=firstName]').type("me");
            cy.get('input[formControlName=lastName]').type("not-me");
            cy.get('input[formControlName=email]').type("me@not-me.com");
            cy.get('input[formControlName=password]').type("azerty{enter}");
      
            cy.url().should('include', '/login');
            
        });
    
    });

}