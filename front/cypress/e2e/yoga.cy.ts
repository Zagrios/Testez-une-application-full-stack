/// <reference types="cypress" />

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

describe('Session admin spec', () => {
  
    it('Should login successfull', () => {

        cy.visit('/login');

        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'userName',
                firstName: 'firstName',
                lastName: 'lastName',
                admin: true
            }
        });

        cy.intercept('GET', '/api/session', []).as('session');

        cy.get('input[formControlName=email]').type("me@not-me.com");
        cy.get('input[formControlName=password]').type("azerty{enter}{enter}");

        cy.url().should('include', '/sessions');

    });

    it('Should create a session and show it', () => {
    
        cy.url().should('include', '/sessions');

        cy.intercept('GET', '/api/teacher', {
            body: [{
                id: 1,
                firstName: 'Mathieu',
                lastName: 'GRIES-PEROZ',
            }]
        });

        cy.intercept('POST', '/api/session', {
            body: {
                id: 1,
                name: 'Session',
                description: 'A session',
                date: '2023-03-19T00:00:00.000+00:00',
                teacher_id: 1,
            },
        });

        cy.intercept('GET', '/api/session', {
            body: [{
                id: 1,
                name: 'Session',
                description: 'A session',
                date: '2023-03-19T00:00:00.000+00:00',
                teacher_id: 1,
                users: []
            }]
        });

        cy.get('button[routerLink=create]').click();

        cy.get('input[formControlName=name]').type("Session");
        cy.get('input[formControlName=date]').type("2023-03-19");
        cy.get('mat-select[formControlName=teacher_id]').click().get('mat-option').contains('Mathieu GRIES-PEROZ').click();
        cy.get('textarea[formControlName=description]').type("A session");

        cy.get('button[type=submit]').click();

        cy.get("mat-card-title").should('contain', 'Session');

    });

    it('Should update a session', () => {
    
        cy.url().should('include', '/sessions');

        cy.intercept('GET', '/api/teacher', {
            body: [{
                id: 1,
                firstName: 'Mathieu',
                lastName: 'GRIES-PEROZ',
            }]
        });

        cy.intercept('GET', '/api/session/1', {
            body: {
                id: 1,
                name: 'Session',
                description: 'A session',
                date: '2023-03-19T00:00:00.000+00:00',
                teacher_id: 1,
            },
        });

        cy.intercept('PUT', '/api/session/1', {
            body: {
              id: 1,
              name: 'Yoga du dimanche',
              date: '2023-03-19T00:00:00.000+00:00',
              teacher_id: 1,
              description: 'A session'
            },
        });

        cy.get('button[data-test-id=edit-btn]').click();

        cy.url().should('include', '/sessions/update');

        cy.get('input[formControlName=name]').clear().type("Yoga du dimanche");

        cy.intercept('GET', '/api/session', {
            body: [{
                id: 1,
                name: 'Yoga du dimanche',
                date: '2023-03-19T00:00:00.000+00:00',
                teacher_id: 1,
                description: 'A session',
                users: []
            }]
        });

        cy.get('button[type=submit]').click();

        cy.get("mat-card-title").should('contain', 'Yoga du dimanche');
    });

    it('Should delete a session', () => {
    
        cy.url().should('include', '/sessions');

        cy.intercept('GET', '/api/session/1', {
            body: {
              id: 1,
              name: 'Yoga du dimanche',
              date: '2023-03-19T00:00:00.000+00:00',
              teacher_id: 1,
              description: 'A session'
            },
        });

        cy.intercept('GET', '/api/teacher/1', {
            body: {
                id: 1,
                firstName: 'Mathieu',
                lastName: 'GRIES-PEROZ',
            }
        });

        cy.get('button[data-test-id=detail-btn]').click();

        cy.intercept('DELETE', '/api/session/1', {
            status: 200
        });

        cy.intercept('GET', '/api/session', {
            body: []
        });

        cy.get('button[data-test-id=delete-btn]').click();

        cy.url().should('include', '/sessions');

        cy.get('div[class="items mt2"]').should('not.have.descendants');
    
    });


});

describe('Session not admin spec', () => {

    it('Should login successfull', () => {

        cy.visit('/login');

        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'userName',
                firstName: 'firstName',
                lastName: 'lastName',
                admin: false
            }
        });

        cy.intercept('GET', '/api/session', {
            body: [{
                id: 1,
                name: 'Yoga du dimanche',
                date: '2023-03-19T00:00:00.000+00:00',
                teacher_id: 1,
                description: 'A session',
                users: []
            }]
        });

        cy.get('input[formControlName=email]').type("me@not-me.com");
        cy.get('input[formControlName=password]').type("azerty{enter}{enter}");

        cy.url().should('include', '/sessions');

    });

    it('Should update a session', () => {
    
        cy.url().should('include', '/sessions');

        cy.intercept('GET', '/api/session/1', {
            body: {
              id: 1,
              name: 'Yoga du dimanche',
              date: '2023-03-19T00:00:00.000+00:00',
              teacher_id: 1,
              description: 'A session'
            },
        });

        cy.intercept('GET', '/api/teacher/1', {
            body: {
                id: 1,
                firstName: 'Mathieu',
                lastName: 'GRIES-PEROZ',
            }
        });

        cy.get('button[data-test-id=detail-btn]').click();

        cy.get('button[data-test-id=delete-btn]').should('not.exist');

    });

});