import { GameBuilder, LevelDataBuilder } from './GameBuilder';

export class AdminManager {
    private container: HTMLDivElement;
    private toggleBtn: HTMLButtonElement;
    private isVisible: boolean = false;
    private gameBuilder: GameBuilder;
    private onLevelDataChange: ((data: LevelDataBuilder) => void) | null = null;

    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'admin-panel';
        this.container.style.display = 'none';
        this.container.style.position = 'fixed'; // Changed to fixed to stay on screen
        this.container.style.top = '10px';
        this.container.style.right = '10px';
        this.container.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        this.container.style.color = 'white';
        this.container.style.padding = '15px';
        this.container.style.borderRadius = '8px';
        this.container.style.zIndex = '99999'; // High z-index to ensure visibility
        this.container.style.fontFamily = 'Arial, sans-serif';
        this.container.style.minWidth = '300px';
        this.container.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
        this.container.setAttribute('role', 'dialog');
        this.container.setAttribute('aria-label', 'Admin Panel');
        this.container.tabIndex = -1;

        // Add Header
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '15px';

        const title = document.createElement('h2');
        title.textContent = 'Admin Panel';
        title.style.margin = '0';
        title.style.fontSize = '18px';
        title.style.color = '#fff';
        header.appendChild(title);

        const closeBtn = document.createElement('button');
        closeBtn.id = 'admin-close-btn';
        closeBtn.innerHTML = '&#x2715;';
        closeBtn.style.background = 'transparent';
        closeBtn.style.border = 'none';
        closeBtn.style.color = '#ccc';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.padding = '0';
        closeBtn.style.lineHeight = '1';
        closeBtn.setAttribute('aria-label', 'Close Admin Panel');

        closeBtn.addEventListener('mouseenter', () => closeBtn.style.color = '#fff');
        closeBtn.addEventListener('mouseleave', () => closeBtn.style.color = '#ccc');
        closeBtn.onclick = () => this.toggle();

        header.appendChild(closeBtn);
        this.container.appendChild(header);

        document.body.appendChild(this.container);

        this.toggleBtn = document.createElement('button');
        this.toggleBtn.id = 'admin-toggle-btn';
        this.toggleBtn.textContent = '⚙️ Admin';
        this.toggleBtn.style.position = 'fixed'; // Changed to fixed
        this.toggleBtn.style.bottom = '20px'; // Moved up slightly
        this.toggleBtn.style.left = '20px';   // Moved to left to avoid game UI overlap (qandon)
        this.toggleBtn.style.zIndex = '99999'; // High z-index
        this.toggleBtn.style.padding = '10px 15px';
        this.toggleBtn.style.backgroundColor = '#4CAF50';
        this.toggleBtn.style.color = 'white';
        this.toggleBtn.style.border = 'none';
        this.toggleBtn.style.borderRadius = '5px';
        this.toggleBtn.style.cursor = 'pointer';
        this.toggleBtn.style.fontSize = '14px';
        this.toggleBtn.setAttribute('aria-label', 'Toggle Admin Panel');
        this.toggleBtn.setAttribute('aria-expanded', 'false');
        this.toggleBtn.setAttribute('aria-controls', 'admin-panel');

        // Add hover effect for better feedback
        this.toggleBtn.addEventListener('mouseenter', () => {
            this.toggleBtn.style.backgroundColor = '#45a049';
        });
        this.toggleBtn.addEventListener('mouseleave', () => {
            this.toggleBtn.style.backgroundColor = '#4CAF50';
        });

        this.toggleBtn.onclick = () => this.toggle();

        document.body.appendChild(this.toggleBtn);

        this.gameBuilder = new GameBuilder(this.container);
        this.gameBuilder.onApply((data) => {
            if (this.onLevelDataChange) {
                this.onLevelDataChange(data);
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.toggle();
            }
        });
    }

    public setOnLevelDataChange(callback: (data: LevelDataBuilder) => void) {
        this.onLevelDataChange = callback;
    }

    public toggle() {
        this.isVisible = !this.isVisible;
        this.container.style.display = this.isVisible ? 'block' : 'none';
        this.toggleBtn.setAttribute('aria-expanded', this.isVisible.toString());

        if (this.isVisible) {
            this.container.focus();
        } else {
            this.toggleBtn.focus();
        }
    }

    public getContainer(): HTMLElement {
        return this.container;
    }
}
