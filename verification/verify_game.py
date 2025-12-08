
import asyncio
from playwright.async_api import async_playwright, expect

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Emulate a desktop viewport (Landscape)
        context = await browser.new_context(viewport={'width': 1280, 'height': 720})
        page = await context.new_page()

        # Wait for server to start - using port 8000 based on log
        try:
            await page.goto("http://localhost:8000", timeout=10000)
        except:
             # retry once
            await asyncio.sleep(2)
            await page.goto("http://localhost:8000")

        # Wait for the game canvas to appear
        await page.wait_for_selector("canvas")

        # Allow some time for the game scene to render and animations to settle
        await asyncio.sleep(2)

        # Take a screenshot of the landscape view
        await page.screenshot(path="verification/verification.png")

        # Now try a portrait viewport to verify responsiveness
        await page.set_viewport_size({"width": 360, "height": 640})
        await asyncio.sleep(1) # Wait for resize event to handle
        await page.screenshot(path="verification/verification_portrait.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
