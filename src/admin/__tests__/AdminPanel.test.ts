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
});
