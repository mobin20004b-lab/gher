from playwright.sync_api import sync_playwright

def verify_game_load():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to http://localhost:8000")
            page.goto("http://localhost:8000")

            # Print page title
            print(f"Page title: {page.title()}")

            # Wait for canvas directly as Play button might be canvas based or overlay
            # Inspecting index.html or MainMenu.ts would reveal how start works.
            # Assuming click on screen works if there is a "Press any key" or similar.

            # Let's take a screenshot of the initial load
            page.wait_for_timeout(2000)
            page.screenshot(path="verification/verification_initial.png")
            print("Initial screenshot taken")

            # Simulate key press to start if needed (Space or Enter)
            page.keyboard.press("Space")
            page.wait_for_timeout(1000)

            # In GameScene, we should see the slots.
            # Level 1 has 2 words. We expect to see 2 rows of slots.

            page.screenshot(path="verification/verification.png")
            print("Game screenshot taken")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_game_load()
