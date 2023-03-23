/// <reference types="cypress" />

describe('Profile spec', () => {
    
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

    it('Should delete profile', () => {
        cy.url().should('include', '/sessions');

        cy.intercept('GET', '/api/user/1', {
            body: [{
                    id: 1,
                    firstName: 'firstName',
                    lastName: 'lastName',
                    createdAt: '2023-03-19T00:00:00',
                    updatedAt: '2023-03-19T00:00:00',
                    email: 'me@not-me.com',
                    admin: true
            }]
        });
  
        cy.get('[routerLink=me]').click();
        cy.url().should('include', '/me');
        
        cy.intercept('DELETE', '/api/user/1', {
            status: 200
        });

        cy.get('button[data-test-id=delete-btn').click();
    });



});