# UI/UX Refactor Plan

## Focus Area: UI/UX
**Goal:** Refactor the UI to adhere to best practices, starting with a reusable Button component and improved Main Menu.

## Plan Steps

1.  *Create `src/ui/Button.ts`.*
    -   [x] Implement a class extending `Phaser.GameObjects.Container`.
    -   [x] Support custom background (texture or color), text, and callback.
    -   [x] Add hover (scale/tint) and click animations.
    -   [x] Add accessibility support (visual focus state).
2.  *Refactor `src/scenes/MainMenu.ts`.*
    -   [x] Replace the inline button code with the new `Button` component.
    -   [x] Improve the layout and spacing.
    -   [x] Ensure keyboard navigation triggers the button's action visually.
3.  *Complete pre commit steps*
    -   [x] Complete pre commit steps to make sure proper testing, verifications, reviews and reflections are done.
4.  *Submit the change.*
