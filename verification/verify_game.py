from playwright.sync_api import sync_playwright

def verify_game_load():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to http://localhost:8000")
            page.goto("http://localhost:8000")

            # Wait for game canvas
            print("Waiting for canvas...")
            page.wait_for_selector("canvas", timeout=10000)

            # Wait a bit for assets to load and render
            print("Waiting for rendering...")
            page.wait_for_timeout(5000)

            # Take screenshot of initial state
            page.screenshot(path="verification_game_initial.png")
            print("Screenshot taken: verification_game_initial.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_game_load()
