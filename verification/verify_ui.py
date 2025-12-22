from playwright.sync_api import sync_playwright

def verify_main_menu():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:8000")
            # Wait for canvas to be present, meaning Phaser has started
            page.wait_for_selector("canvas", timeout=10000)
            # Give it a bit more time to render the scene
            page.wait_for_timeout(2000)
            page.screenshot(path="verification/verification.png")
            print("Screenshot taken")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_main_menu()
