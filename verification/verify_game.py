from playwright.sync_api import sync_playwright

def verify_game():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000")

        # Wait for game to load
        page.wait_for_timeout(2000)

        # Take screenshot of initial state
        page.screenshot(path="verification/game_initial.png")
        print("Initial screenshot taken.")

        # We can try to simulate clicking a letter if we know where they are
        # Since it's canvas, we might need to click by coordinates or just verify the canvas exists

        # Verify canvas exists
        canvas = page.locator("canvas")
        if canvas.count() > 0:
            print("Canvas found.")

        browser.close()

if __name__ == "__main__":
    verify_game()
