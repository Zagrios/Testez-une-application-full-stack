/// <reference types="cypress" />

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