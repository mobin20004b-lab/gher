from playwright.sync_api import sync_playwright

def verify_admin_panel():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app
        page.goto("http://localhost:8000")

        # Wait for the game to load slightly
        page.wait_for_timeout(2000)

        # Click the Admin button
        admin_btn = page.locator("#admin-toggle-btn")
        admin_btn.wait_for(state="visible")
        admin_btn.click()

        # Wait for panel to appear
        panel = page.locator("#admin-panel")
        panel.wait_for(state="visible")

        # Fill in the form
        page.fill("#builder-letters", "a,b,c,d")
        page.fill("#builder-words", "abc")
        page.fill("#builder-extras", "abd")

        # Take a screenshot of the open admin panel
        page.screenshot(path="verification/verification.png")

        browser.close()

if __name__ == "__main__":
    verify_admin_panel()
