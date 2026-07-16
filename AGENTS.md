# Plato Agent Guide

This file is the canonical handoff for coding agents working in this repository.
Read it before changing the application. `CLAUDE.md` imports this file so Codex,
Claude Code, and compatible harnesses share the same project guidance.

## Project purpose

Plato is an interactive React and Three.js simulation of the entry angle
conjecture. It is intended to support several future directions without forcing
them into one product:

- academic experiments and visual explanations;
- exploratory mathematical tools;
- game-like experiences built on the same beam and maze foundation.

Preserve the separation between mathematical simulation and visual presentation.
New renderers, launch strategies, maze generators, and analysis tools should be
possible without rewriting the beam physics.

## Toolchain

- Node.js 22.13 or newer (`.nvmrc` is included).
- pnpm 11.13 or newer; do not introduce npm or Yarn lockfiles.
- Vite, React 19, React Three Fiber, Three.js, and Vitest.

Common commands:

```sh
pnpm install
pnpm dev
pnpm test
pnpm test:watch
pnpm build
pnpm preview
```

The development URL is <http://localhost:5173/plato/>. The `/plato/` base path
is required for GitHub Pages and is configured in `vite.config.js`.

Before handing off a change, run at least:

```sh
pnpm test
pnpm build
```

Do not commit, deploy, or publish unless the user explicitly asks.

## Runtime controls

- <kbd>Space</kbd>: launch a white beam from a randomized entry position.
- <kbd>Shift</kbd> + <kbd>Space</kbd>: launch the fixed yellow trajectory.
- Development builds expose 10/50/100-beam stress controls, a clear button, and
  live renderer/simulation instrumentation.

## Architecture

`src/App.jsx`
: Application composition root. It creates the seeded maze, collision index,
  beam controller, and shared metrics. Keep it small and declarative.

`src/scene/`
: Three.js scene composition and camera setup. Scene-level lighting belongs here;
  beam-specific lighting does not.

`src/maze/`
: Maze generation, wall transforms, instanced wall rendering, floor rendering,
  and spatially indexed collision detection.

`src/beams/`
: Beam creation, keyboard/controller state, mutable lifecycle simulation, pure
  path/reflection functions, bounds checks, batched rendering, textures, and the
  reflection-light pool.

`src/dev/`
: Development-only instrumentation and stress controls. Diagnostic UI must not
  become a production dependency.

`src/hooks/`
: Small generic React hooks.

`src/sceneConfig.js`
: Shared visual and simulation constants. Prefer named configuration here over
  unexplained numbers scattered through components.

Keep pure mathematical functions in ordinary `.js` modules. Keep React and
React Three Fiber lifecycle code in `.jsx` components or hooks.

## Important invariants

### Maze stability

- The default maze is deterministic through `MAZE_SEED`.
- Do not casually change the seeded random call order in `generateMaze.js`; doing
  so changes the maze even when the seed remains identical.
- A wall marked as a door is omitted from both rendering and collision data.
- Rendering transforms and collision boxes must continue to derive from the same
  wall representation.

### Beam behavior

- Every beam has independent position, direction, path, age, and color.
- Beam path length remains constant while the path advances and reflects.
- Collision calculations are two-dimensional; rendering uses the configured Z
  positions and heights.
- Beams are removed after clearing the maze bounds or reaching the maximum
  lifetime. Preserve both safeguards.
- Frame delta is capped for simulation stability. Do not pass an unbounded delta
  into beam movement or attempt to simulate a long stalled frame in one step.

### Lighting and appearance

- Beam glow should illuminate the floor and nearby inner wall faces.
- Glow should not visibly bleed through the maze's outer walls.
- The ambient and directional lighting establish the baseline maze brightness;
  avoid changing them as a side effect of unrelated work.
- Reflection lights use a bounded reusable pool. Increasing the pool has a large
  GPU cost and should be measured with the stress controls.

### Performance model

- Maze walls render through one `InstancedMesh`.
- Visible beam planes are written into shared instanced batches, one batch per
  texture/color.
- Per-frame beam points live in mutable simulation records, not React state.
- React state changes only when beams are created or removed.
- Wall collision uses the spatial index in `wallCollision.js`; do not replace it
  with `Raycaster.intersectObjects` across every wall.
- Keep the development overlay useful. Draw calls, segments, raycasts, wall
  candidate tests, and peak frame time are intentional regression signals.

Use the 10/50/100-beam controls before and after performance-sensitive changes.
Optimize measured bottlenecks, and record any deliberate visual tradeoff.

## Extension guidance

### Academic or analytical concepts

- Build analysis on the pure functions in `beamPath.js` and the wall collision
  index rather than scraping rendered objects.
- Add structured event/output data if an experiment needs reflection counts,
  angles, path histories, or exit classifications.
- Keep deterministic random sources injectable so experiments are reproducible.

### Game-like concepts

- Add launch rules through beam factories/controllers rather than hard-coding
  input behavior into the renderer.
- Add game state above `Experience`; do not put scoring or progression inside
  collision primitives.
- Prefer new visual layers or materials over coupling game rules to Three.js
  object identities.

### Alternate mazes or scenes

- New maze algorithms should produce the existing wall-map shape, or introduce a
  deliberate adapter at the maze boundary.
- If maze dimensions become dynamic, derive bounds, rendering transforms, floor
  size, and collision index from the same configuration object.

## Testing expectations

- Add or update focused Vitest coverage for changes to pure simulation,
  generation, bounds, transforms, or collision behavior.
- Test deterministic behavior using injected seeded random functions.
- For rendering changes, verify the local app visually in addition to running
  tests and the production build.
- Use approximate assertions for floating-point vector calculations.
- A large production bundle advisory is currently expected because Three.js and
  React Three Fiber are in the main experience bundle. Treat a new build failure
  or a material size jump as a regression; do not hide warnings without reason.

## Repository hygiene

- Use pnpm and preserve `pnpm-lock.yaml`.
- Do not restore Create React App files, `react-scripts`, `package-lock.json`, old
  logos/manifests, or the removed Three.js per-wall raycasting path.
- Do not add generated screenshots, `dist/`, logs, or temporary profiling output
  to source control.
- Preserve unrelated user changes in a dirty worktree.
- Keep naming consistently on “beam”; “laser” is legacy terminology and should
  not be reintroduced into new APIs.
- Prefer focused modules and narrow props over growing `App.jsx` or
  `Experience.jsx` into catch-all components.

## Definition of done

A change is ready for user review when:

1. behavior and architectural boundaries remain coherent;
2. relevant tests cover new pure logic;
3. `pnpm test` passes;
4. `pnpm build` passes;
5. interactive or visual behavior has been checked when applicable;
6. obsolete code and temporary artifacts introduced during the work are removed;
7. no commit or deployment has occurred without explicit authorization.
