from playwright.sync_api import sync_playwright

def verify_admin_panel():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app (assuming default Vite port)
        page.goto("http://localhost:8000")

        # Wait for the admin toggle button to appear
        page.wait_for_selector("#admin-toggle-btn")

        # Click the toggle button to open the admin panel
        page.click("#admin-toggle-btn")

        # Wait for the admin panel to be visible
        page.wait_for_selector("#admin-panel", state="visible")

        # Focus on the letters input to show the new focus style
        page.focus("#builder-letters")

        # Take a screenshot of the admin panel with the focused input
        page.screenshot(path="verification/admin_panel_focus.png")

        # Also take a screenshot of the button hover state if possible (harder in static screenshot)
        # But we can verify the button styles are applied by looking at the screenshot

        browser.close()

if __name__ == "__main__":
    verify_admin_panel()
