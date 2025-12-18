from playwright.sync_api import sync_playwright

def verify_font(page):
    # Port is 8000 based on vite.config.ts
    page.goto("http://localhost:8000")
    # Wait for the game canvas to appear
    page.wait_for_selector("canvas")
    # Wait for a bit to ensure fonts are loaded and scene is rendered
    page.wait_for_timeout(3000)

    # Take a screenshot
    page.screenshot(path="verification/verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_font(page)
        finally:
            browser.close()
