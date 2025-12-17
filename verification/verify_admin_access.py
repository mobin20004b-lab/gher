from playwright.sync_api import sync_playwright, expect
import time

def verify_admin_panel_accessibility():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app (assuming default vite port 8000)
        page.goto("http://localhost:8000")

        # Wait for the admin button to be visible
        # Using get_by_label which tests our aria-label addition!
        admin_btn = page.get_by_label("Toggle Admin Panel")
        expect(admin_btn).to_be_visible()

        # Check initial state
        expect(admin_btn).to_have_attribute("aria-expanded", "false")
        expect(admin_btn).to_have_attribute("aria-controls", "admin-panel")

        # Test Hover (visual check via screenshot, though hard to capture in static image)
        admin_btn.hover()

        # Click to open
        admin_btn.click()

        # Verify expanded state
        expect(admin_btn).to_have_attribute("aria-expanded", "true")

        # Verify panel is visible
        # Using exact=True to distinguish "Admin Panel" from "Toggle Admin Panel" if text matches partially
        # Or even better, use get_by_role("dialog", name="Admin Panel")
        admin_panel = page.get_by_role("dialog", name="Admin Panel")
        expect(admin_panel).to_be_visible()

        # Take a screenshot showing the open admin panel
        page.screenshot(path="/home/jules/verification/verification.png")

        print("Verification successful!")
        browser.close()

if __name__ == "__main__":
    verify_admin_panel_accessibility()
