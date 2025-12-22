# UI/UX Refactor Plan

## Focus Area: UI/UX
**Goal:** Refactor the UI to adhere to best practices, starting with a reusable Button component and improved Main Menu.

## Plan Steps

1.  *Enhance `src/ui/Button.ts` to support customization.*
    -   [x] Update constructor to accept a `ButtonConfig` object.
    -   [x] Implement support for custom background color, hover color, text styles, and optional texture.
    -   [x] Ensure accessibility focus works for both shapes and textures.
2.  *Update `src/scenes/MainMenu.ts`.*
    -   [x] Ensure it is compatible with the new `Button` signature.
    -   [x] (Optional) tweak styling using the new config.
3.  *Complete pre commit steps*
    -   Complete pre commit steps to make sure proper testing, verifications, reviews and reflections are done.
4.  *Submit the change.*
