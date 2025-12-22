from playwright.sync_api import sync_playwright

def verify_admin_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the game
        page.goto('http://localhost:8000')

        # Wait for game to load (canvas element)
        page.wait_for_selector('canvas')

        # Click the Admin toggle button
        admin_toggle = page.get_by_label("Toggle Admin Panel")
        admin_toggle.click()

        # Wait for the panel to be visible
        admin_panel = page.get_by_role("dialog", name="Admin Panel")

        # Take a screenshot of the admin panel
        page.screenshot(path="verification/admin_panel_initial.png")

        # Find the Apply button
        apply_btn = page.get_by_role("button", name="Apply Changes")

        # Check styles (optional, but good for debugging)
        bg_color = apply_btn.evaluate("element => getComputedStyle(element).backgroundColor")
        print(f"Initial Background Color: {bg_color}")

        # Click the button
        apply_btn.click()

        # Wait for text change
        page.wait_for_timeout(100) # Small delay for UI update

        # Take a screenshot of the feedback state
        page.screenshot(path="verification/admin_panel_feedback.png")

        browser.close()

if __name__ == "__main__":
    verify_admin_ui()
