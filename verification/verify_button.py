from playwright.sync_api import sync_playwright

def verify_main_menu():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:8000")
            # Wait for the Main Menu to appear.
            # We look for the "Start Game" text which we know is on the button.
            # In Phaser, text is rendered on canvas, so regular DOM selectors won't work for the text node itself directly as an element,
            # but Playwright might not see the canvas content as text.
            # However, we can just wait for a bit and take a screenshot of the canvas.

            page.wait_for_timeout(3000) # Wait for assets to generate and scene to start

            page.screenshot(path="verification/main_menu_button.png")
            print("Screenshot taken.")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_main_menu()
