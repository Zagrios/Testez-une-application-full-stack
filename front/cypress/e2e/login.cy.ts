/// <reference types="cypress" />

export function run(){

    describe('Login spec', () => {
        it('Should login successfull', () => {
    
            cy.visit('/login');
    
            cy.intercept('POST', '/api/auth/login', {
                body: {
                    id: 1,
                    username: 'userName',
                    firstName: 'firstName',
                    lastName: 'lastName',
                    admin: true
                },
            });
    
            cy.intercept('GET', '/api/session', []).as('session');
    
            cy.get('input[formControlName=email]').type("me@not-me.com");
            cy.get('input[formControlName=password]').type("azerty{enter}{enter}");
    
            cy.url().should('include', '/sessions');
    
        });
    
        it('Should logout', () => {
    
            cy.url().should('include', '/sessions');
            cy.get('span[data-test-id=logout-btn]').click();
            cy.url().should('not.contain', '/sessions');
    
        });
    
        it('Should error if wrong credential', () => {
            
            cy.visit('/login');
    
            cy.intercept('POST', '/api/auth/login', { statusCode: 401});
    
            cy.get('input[formControlName=email]').type("me@not-me.com");
            cy.get('input[formControlName=password]').type("azerty{enter}{enter}");
    
            cy.url().should('not.contain', '/sessions');
    
            cy.get('p').should('exist');
    
        });
    
        it('Shoud error if missing input email', () => {
    
            cy.visit('/login');
    
            cy.get('input[formControlName=password]').type("azerty{enter}{enter}");
    
            cy.get('input[formControlName=email]').should('have.class', 'ng-invalid');
    
        });
    
        it('Shoud submit disabled if missing passord', () => {
    
            cy.visit('/login');
    
            cy.get('input[formControlName=email]').type("me@not-me.com");
    
            cy.get('button[type=submit]').should('be.disabled');
    
        });
    });
    
}