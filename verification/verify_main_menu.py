from playwright.sync_api import sync_playwright

def verify_main_menu():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Navigate to the app (using the default Vite port)
            page.goto("http://localhost:8000")

            # Wait for the main menu title to be visible (canvas content isn't directly inspectable like DOM,
            # but we can wait for a reasonable amount of time or look for console logs if we added them.
            # However, since it's canvas, we rely on time for now, or check if canvas exists).
            page.wait_for_selector("canvas", state="visible")

            # Wait a bit for the scene to transition from Preloader to MainMenu
            page.wait_for_timeout(2000)

            # Take a screenshot
            page.screenshot(path="verification/main_menu_verification.png")
            print("Screenshot taken successfully.")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_main_menu()
