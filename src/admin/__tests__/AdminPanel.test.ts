import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AdminManager } from '../AdminManager';

describe('AdminManager', () => {
    let adminManager: AdminManager;

    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>';
        adminManager = new AdminManager();
    });

    afterEach(() => {
        document.body.innerHTML = '';
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

    it('should have a close button inside the panel', () => {
        const closeBtn = document.getElementById('admin-close-btn');
        expect(closeBtn).not.toBeNull();
        expect(closeBtn?.getAttribute('aria-label')).toBe('Close Admin Panel');
    });

    it('should close the panel when close button is clicked', () => {
        adminManager.toggle(); // Open it first
        const container = document.getElementById('admin-panel');
        const closeBtn = document.getElementById('admin-close-btn');

        expect(container?.style.display).toBe('block');

        closeBtn?.click();
        expect(container?.style.display).toBe('none');
    });
});
