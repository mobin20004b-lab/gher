import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AdminManager } from '../AdminManager';

describe('AdminManager', () => {
    let adminManager: AdminManager;

    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>';
        adminManager = new AdminManager();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    it('should create an admin container attached to body', () => {
        const container = document.getElementById('admin-panel');
        expect(container).not.toBeNull();
        expect(container?.style.display).toBe('none');
    });

    it('should toggle visibility', () => {
        adminManager.toggle();
        const container = document.getElementById('admin-panel');
        expect(container?.style.display).toBe('block');

        adminManager.toggle();
        expect(container?.style.display).toBe('none');
    });

    it('should create a toggle button', () => {
        const btn = document.getElementById('admin-toggle-btn');
        expect(btn).not.toBeNull();
        expect(btn?.textContent).toBe('⚙️ Admin');
    });

    it('should toggle visibility when toggle button is clicked', () => {
        const btn = document.getElementById('admin-toggle-btn');
        const container = document.getElementById('admin-panel');

        btn?.click();
        expect(container?.style.display).toBe('block');

        btn?.click();
        expect(container?.style.display).toBe('none');
    });

    it('should have correct accessibility attributes', () => {
        const btn = document.getElementById('admin-toggle-btn');
        const container = document.getElementById('admin-panel');

        expect(btn?.getAttribute('aria-label')).toBe('Toggle Admin Panel');
        expect(btn?.getAttribute('aria-controls')).toBe('admin-panel');
        expect(container?.getAttribute('role')).toBe('dialog');
        expect(container?.getAttribute('aria-label')).toBe('Admin Panel');
    });

    it('should update aria-expanded state', () => {
        const btn = document.getElementById('admin-toggle-btn');
        expect(btn?.getAttribute('aria-expanded')).toBe('false');

        adminManager.toggle();
        expect(btn?.getAttribute('aria-expanded')).toBe('true');

        adminManager.toggle();
        expect(btn?.getAttribute('aria-expanded')).toBe('false');
    });

    describe('Keyboard Accessibility', () => {
        it('should close panel on Escape key press', () => {
            adminManager.toggle(); // Open it
            const container = document.getElementById('admin-panel');
            expect(container?.style.display).toBe('block');

            const event = new KeyboardEvent('keydown', { key: 'Escape' });
            document.dispatchEvent(event);

            expect(container?.style.display).toBe('none');
            const btn = document.getElementById('admin-toggle-btn');
            expect(btn?.getAttribute('aria-expanded')).toBe('false');
        });

        it('should move focus to the first input when opened', () => {
            const container = document.getElementById('admin-panel');
            // We need to ensure elements are in the DOM for focus to work
            // JSDOM supports focus management mostly

            adminManager.toggle();

            const firstInput = container?.querySelector('input');
            expect(document.activeElement).toBe(firstInput);
        });

        it('should return focus to toggle button when closed via toggle()', () => {
            adminManager.toggle(); // Open
            adminManager.toggle(); // Close

            const btn = document.getElementById('admin-toggle-btn');
            expect(document.activeElement).toBe(btn);
        });

        it('should return focus to toggle button when closed via Escape', () => {
            adminManager.toggle(); // Open

            const event = new KeyboardEvent('keydown', { key: 'Escape' });
            document.dispatchEvent(event);

            const btn = document.getElementById('admin-toggle-btn');
            expect(document.activeElement).toBe(btn);
        });
    });
});
