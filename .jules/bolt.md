## 2025-12-18 - Large Monolithic Bundle
**Learning:** The default Vite build bundled Phaser (1.2MB) with the game code, causing a large initial download and causing Vite to warn about chunk size.
**Action:** Use `manualChunks` in `vite.config.ts` to split vendor libraries (Phaser) from application code to improve caching and load times.
