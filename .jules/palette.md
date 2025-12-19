# Palette's Journal

## 2024-05-22 - Admin Panel Accessibility
**Learning:** Custom DOM overlays in game engines (like Phaser) require manual focus management to be accessible. Native HTML dialogs handle this partially, but custom `div` overlays do not.
**Action:** When creating custom overlays, always implement `focus()` on open, return focus on close, and listen for `Escape` to close.
