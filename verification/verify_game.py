from playwright.sync_api import sync_playwright

def verify_game_load():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Navigate to the game (Port 8000 based on logs)
            page.goto("http://localhost:8000")

            # Wait for canvas to be present (GameScene loaded)
            page.wait_for_selector("canvas", timeout=10000)

            # Wait a bit for the scene to render (Phaser init)
            page.wait_for_timeout(3000)

            # Take screenshot
            page.screenshot(path="verification/verification.png")
            print("Screenshot taken.")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_game_load()
