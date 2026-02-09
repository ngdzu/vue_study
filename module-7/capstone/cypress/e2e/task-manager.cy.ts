/// <reference types="cypress" />

describe('Task Manager E2E Tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.window().then((win) => {
            win.localStorage.clear();
        });
    });

    it('displays empty state when no tasks', () => {
        cy.get('.empty-message').should('exist');
    });

    it('creates a new task', () => {
        cy.get('input[id="title"]').type('Buy groceries');
        cy.get('input[id="category"]').type('Personal');
        cy.get('input[id="duration"]').clear().type('1800');
        cy.get('form').submit();

        cy.contains('Buy groceries').should('be.visible');
    });

    it('completes a task', () => {
        cy.get('input[id="title"]').type('Write report');
        cy.get('input[id="category"]').type('Work');
        cy.get('input[id="duration"]').clear().type('3600');
        cy.get('form').submit();

        cy.get('input[type="checkbox"]').click();
        cy.get('.task-item').should('have.class', 'completed');
    });

    it('filters tasks by category', () => {
        cy.get('input[id="title"]').type('Work Task');
        cy.get('input[id="category"]').type('Work');
        cy.get('input[id="duration"]').clear().type('3600');
        cy.get('form').submit();

        cy.get('input[id="title"]').clear().type('Personal Task');
        cy.get('input[id="category"]').clear().type('Personal');
        cy.get('form').submit();

        cy.get('select').select('Work');
        cy.contains('Work Task').should('be.visible');
        cy.contains('Personal Task').should('not.be.visible');
    });

    it('displays task statistics', () => {
        cy.get('input[id="title"]').type('Task 1');
        cy.get('input[id="category"]').type('Work');
        cy.get('input[id="duration"]').clear().type('3600');
        cy.get('form').submit();

        cy.contains('Total Tasks').parent().should('contain', '1');
    });

    it('timer functionality works', () => {
        cy.get('.timer-display').should('contain', '00:00:00');
        cy.contains('Start').click();
        cy.get('button:contains("Pause")').should('not.be.disabled');
    });

    it('deletes a task', () => {
        cy.get('input[id="title"]').type('Task to delete');
        cy.get('input[id="category"]').type('Work');
        cy.get('form').submit();

        cy.get('.btn-delete').click();
        cy.contains('Task to delete').should('not.exist');
    });
});
