
from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        # Wait for dev server to be ready
        try:
            # Note: Changed to port 8001 based on log
            page.goto("http://localhost:8001", timeout=10000)

            # Wait for canvas to load
            page.wait_for_selector("canvas")

            # Give it some time to render the graphics and animations
            time.sleep(2)

            # Take screenshot of the initial state
            page.screenshot(path="verification/verification.png")
            print("Screenshot saved to verification/verification.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
