# Plato

An interactive React and Three.js simulation of the entry angle conjecture.
The project is structured as a reusable foundation for mathematical experiments,
visual demonstrations, and game-like variants.

## Requirements

- Node.js 22.13 or newer (`.nvmrc` is included)
- pnpm 11.13 or newer

Enable the pinned pnpm version through Corepack if necessary:

```sh
corepack enable
```

## Development

```sh
pnpm install
pnpm dev
```

Vite serves the app at <http://localhost:5173/plato/>.

- <kbd>Space</kbd> launches a beam from a randomized entry position.
- <kbd>Shift</kbd> + <kbd>Space</kbd> launches the fixed yellow trajectory.
- The terminal dashboard exposes controls for launching 10, 50, or 100 beams
  and displays live renderer and simulation telemetry.

## Architecture

The runtime is divided by responsibility:

- `src/App.jsx` owns application state and composes the experience.
- `src/scene/` defines the Three.js scene and camera.
- `src/maze/` owns maze generation, rendering, wall transforms, and the spatial
  collision index.
- `src/beams/` owns beam creation, lifecycle simulation, bounds, batched
  rendering, textures, and reflection lighting.
- `src/ui/` contains the terminal dashboard and live scene telemetry bridge.
- `src/sceneConfig.js` is the shared configuration boundary for visual and
  simulation constants.

Beam physics is intentionally independent from React rendering. Mutable
simulation records advance inside the frame loop, while instanced GPU batches
consume their paths. This keeps the simulation suitable for alternate renderers
or future academic analysis without coupling it to component state.

## Extension points

- Add maze algorithms behind the same wall-map representation used by
  `generateMaze`.
- Add beam launch strategies through `createBeam` or a new controller.
- Add experimental physics by extending the pure functions in `beamPath.js`.
- Build alternate visualizations around the existing collision index and beam
  registry without changing lifecycle management.
- Extend product controls and telemetry in `src/ui/` without coupling them to
  the beam simulation or Three.js render batches.

## Quality checks

```sh
pnpm test
pnpm build
```

Use `pnpm test:watch` during development and `pnpm preview` to inspect the
production bundle locally.

## Deployment

The Vite base path is configured for GitHub Pages at
<https://alexandre-eisenmann.github.io/plato/>.

```sh
pnpm deploy
```

This builds the app into `dist/` and publishes it to the `gh-pages` branch.
