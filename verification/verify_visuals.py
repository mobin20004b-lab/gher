import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Navigate to the game (assuming dev server is running)
        await page.goto("http://localhost:8000")

        # Wait for game to load (give it enough time)
        await page.wait_for_timeout(3000)

        # Coordinates for landscape mode (1280x720)
        # Based on GameScene: saucerX = width * 0.75 (960), saucerY = height * 0.6 (432)
        # Radius is 80.
        # Letters are placed at angles around the center.
        # We need to hit the letters.

        center_x = 960
        center_y = 432
        radius = 80

        # We will drag in a circle around the center to hit all letters.
        # Start at top (angle -PI/2) -> x = center, y = center - radius

        start_x = center_x
        start_y = center_y - radius

        print(f"Starting drag at {start_x}, {start_y}")

        await page.mouse.move(start_x, start_y)
        await page.mouse.down()

        # Move in a circle
        steps = 30
        import math

        for i in range(steps):
            angle = -math.pi/2 + (i / steps) * 2 * math.pi
            x = center_x + math.cos(angle) * radius
            y = center_y + math.sin(angle) * radius

            await page.mouse.move(x, y)
            await page.wait_for_timeout(50) # Slow down to let Phaser process

        # Take screenshot while dragging
        await page.screenshot(path="verification/visual_check.png")
        print("Screenshot saved to verification/visual_check.png")

        await page.mouse.up()
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
