from playwright.sync_api import sync_playwright

def verify_main_menu_debug():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:8000")
            # Wait for any text to render or canvas
            page.wait_for_timeout(5000)

            # Screenshot of whatever is there
            page.screenshot(path="verification/debug_main_menu.png")
            print("Screenshot taken: verification/debug_main_menu.png")

            # Print page content to debug
            # print(page.content())

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_main_menu_debug()
