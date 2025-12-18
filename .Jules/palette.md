## 2024-03-24 - Admin Panel Accessibility
**Learning:** For custom DOM overlays (like an admin panel in a game), standard dialog behaviors (Focus Trap, Escape to close, Return Focus) must be implemented manually.
**Action:** When creating new overlays, always implement `keydown` for Escape and manage focus on open/close.
