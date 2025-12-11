# Gher

A Persian word puzzle game built with [Phaser 3](https://phaser.io/), TypeScript, and Vite.

## Features

- **Interactive Gameplay**: Drag-to-connect letter wheel for word selection.
- **Responsive Design**: Adapts to both mobile and desktop resolutions using `Phaser.Scale.RESIZE`.
- **Procedural Assets**: Core UI assets are generated using Phaser Graphics.
- **Admin Panel**: Built-in admin panel for game management.

## Prerequisites

- Node.js (v14 or higher recommended)
- npm (v6 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mobin20004b-lab/gher.git
   cd gher
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm run dev
```

This will start the Vite server, usually at `http://localhost:5173`.

## Building for Production

To build the project for production:

```bash
npm run build
```

The build artifacts will be generated in the `dist` directory.

## Testing

This project uses [Vitest](https://vitest.dev/) for testing.

To run tests:

```bash
npm test
```

## Project Structure

- `src/`: Source code
  - `main.ts`: Entry point of the game
  - `scenes/`: Phaser scenes (e.g., Preloader, GameScene)
  - `admin/`: Admin panel implementation
  - `__tests__/`: Unit tests
- `public/`: Static assets
- `vite.config.ts`: Vite configuration
- `vitest.config.ts`: Vitest configuration

## License

ISC
