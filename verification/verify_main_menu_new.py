from playwright.sync_api import sync_playwright

def verify_main_menu():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:8000")
            page.wait_for_selector('text=شروع بازی', timeout=10000)

            # Screenshot of main menu
            page.screenshot(path="verification/verification_main_menu.png")
            print("Screenshot taken: verification/verification_main_menu.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_main_menu()
