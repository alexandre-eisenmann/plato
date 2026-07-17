import {useEffect, useMemo, useState} from 'react'
import {createExitHistogram} from '../beams/exitHistogram.js'

const LAUNCH_COUNTS = [1, 10, 50, 100]
const MAZE_SIZES = [10, 20, 30, 40]

export default function Dashboard({
  activeDurations,
  exitEvents,
  onClear,
  onGenerateMaze,
  onLaunch,
  onResetResults,
  outputRef,
  mazeSeed,
  mazeSize,
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [selectedMazeSize, setSelectedMazeSize] = useState(mazeSize)
  useEffect(() => setSelectedMazeSize(mazeSize), [mazeSize])
  const histogram = useMemo(
    () => createExitHistogram(exitEvents, activeDurations),
    [activeDurations, exitEvents],
  )
  const largestBucket = Math.max(
    1,
    ...histogram.map(bucket => bucket.A + bucket.B + bucket.active),
  )
  const exitBCount = exitEvents.filter(event => event.exit === 'B').length

  return (
    <aside
      className="terminal-hud"
      aria-label="Plato simulation console"
      data-collapsed={collapsed}
    >
      <div className="terminal-hud__header">
        <div>
          <span className="terminal-hud__eyebrow">PLATO // OPTICAL LAB</span>
          <h1>ENTRY ANGLE MONITOR</h1>
        </div>
        <div className="terminal-hud__header-actions">
          <span className="terminal-hud__status">LIVE</span>
          <button
            className="terminal-hud__toggle"
            type="button"
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand simulation console' : 'Minimize simulation console'}
            onClick={() => setCollapsed(current => !current)}
          >
            {collapsed ? 'OPEN' : 'MIN'}
          </button>
        </div>
      </div>

      <section
        className="terminal-hud__section terminal-hud__section--controls"
        aria-labelledby="launch-title"
      >
        <div className="terminal-hud__section-title">
          <span id="launch-title">RUN EXPERIMENT</span>
          <span>CTL.01</span>
        </div>
        <div className="experiment-guide" aria-label="Experiment instructions">
          <span><b>01</b> Launch at A</span>
          <i aria-hidden="true">→</i>
          <span><b>02</b> Watch path</span>
          <i aria-hidden="true">→</i>
          <span><b>03</b> Find B</span>
        </div>
        <p className="experiment-copy">
          Exit A records green. A beam reaching Exit B records amber.
        </p>
        <div className="stress-controls" aria-label="Beam launch controls">
          <div className="stress-controls__intro">
            <span className="stress-controls__label">LAUNCH BEAMS</span>
            <small>Select a count</small>
          </div>
          <div className="stress-controls__actions">
            {LAUNCH_COUNTS.map(count => (
              <button
                key={count}
                className={count === 1 ? 'primary' : undefined}
                type="button"
                aria-label={`Launch ${count} beam${count === 1 ? '' : 's'}`}
                onClick={() => onLaunch(count)}
              >
                {count === 1 ? 'START +1' : `+${count}`}
              </button>
            ))}
            <button className="danger" type="button" onClick={onClear}>
              PURGE ACTIVE BEAMS
            </button>
          </div>
        </div>
      </section>

      <section
        className="terminal-hud__section terminal-hud__section--maze"
        aria-labelledby="maze-title"
      >
        <div className="terminal-hud__section-title">
          <span id="maze-title">MAZE CONFIGURATION</span>
          <span>MAP.02</span>
        </div>
        <div className="maze-config">
          <div className="maze-config__sizes" aria-label="Maze size">
            {MAZE_SIZES.map(size => (
              <button
                key={size}
                type="button"
                aria-pressed={selectedMazeSize === size}
                onClick={() => setSelectedMazeSize(size)}
              >
                {size}×{size}
              </button>
            ))}
          </div>
          <div className="maze-config__seed">
            <span>ACTIVE SEED</span>
            <code title={mazeSeed}>{mazeSeed}</code>
          </div>
          <button
            className="maze-config__generate"
            type="button"
            onClick={() => onGenerateMaze(selectedMazeSize)}
          >
            GENERATE NEW {selectedMazeSize}×{selectedMazeSize} MAZE
          </button>
          <small>Generating resets active beams and observations.</small>
        </div>
      </section>

      <section
        className="terminal-hud__section terminal-hud__section--telemetry"
        aria-labelledby="telemetry-title"
      >
        <div className="terminal-hud__section-title">
          <span id="telemetry-title">RENDER TELEMETRY</span>
          <span>SYS.01</span>
        </div>
        <output
          ref={outputRef}
          className="renderer-stats"
          aria-label="Renderer performance statistics"
        >
          Initializing telemetry stream…
        </output>
      </section>

      <section
        className="terminal-hud__section terminal-hud__section--transit"
        aria-labelledby="transit-title"
      >
        <div className="terminal-hud__section-title">
          <span id="transit-title">EXIT TRANSIT TIME</span>
          <span>OBS.03</span>
        </div>
        <div className="histogram-summary">
          <span><i className="legend-a" />EXIT A</span>
          <span><i className="legend-b" />EXIT B</span>
          <span><i className="legend-active" />ACTIVE</span>
          <strong>{exitBCount} B DETECTED</strong>
        </div>
        <div className="exit-histogram" aria-label="Beam exit time histogram">
          {histogram.map(bucket => {
            const total = bucket.A + bucket.B + bucket.active
            return (
              <div className="exit-histogram__row" key={bucket.label}>
                <span className="exit-histogram__label">{bucket.label}<small>S</small></span>
                <div className="exit-histogram__track">
                  <span
                    className="exit-histogram__bar exit-histogram__bar--a"
                    style={{width: `${bucket.A / largestBucket * 100}%`}}
                  />
                  <span
                    className="exit-histogram__bar exit-histogram__bar--b"
                    style={{width: `${bucket.B / largestBucket * 100}%`}}
                  />
                  <span
                    className="exit-histogram__bar exit-histogram__bar--active"
                    style={{width: `${bucket.active / largestBucket * 100}%`}}
                  />
                </div>
                <span className="exit-histogram__count">{total}</span>
              </div>
            )
          })}
        </div>
        <div className="histogram-footer">
          <span>{exitEvents.length} COMPLETED // {activeDurations.length} ACTIVE</span>
          <button type="button" onClick={onResetResults}>RESET DATA</button>
        </div>
      </section>

      <div className="terminal-hud__footer">
        <span><kbd>SPACE</kbd> RANDOM BEAM</span>
      </div>
    </aside>
  )
}
