import {useMemo, useState} from 'react'
import {createExitHistogram} from '../beams/exitHistogram.js'

const LAUNCH_COUNTS = [1, 10, 50, 100]

export default function Dashboard({
  activeDurations,
  exitEvents,
  onClear,
  onLaunch,
  onResetResults,
  outputRef,
}) {
  const [collapsed, setCollapsed] = useState(false)
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

      <section className="terminal-hud__section" aria-labelledby="telemetry-title">
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

      <section className="terminal-hud__section" aria-labelledby="transit-title">
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

      <section
        className="terminal-hud__section terminal-hud__section--controls"
        aria-labelledby="launch-title"
      >
        <div className="terminal-hud__section-title">
          <span id="launch-title">BEAM CONTROL</span>
          <span>CTL.02</span>
        </div>
        <div className="stress-controls" aria-label="Beam launch controls">
          <div className="stress-controls__intro">
            <span className="stress-controls__label">LAUNCH FROM ENTRY A</span>
            <small>Select a beam count to begin</small>
          </div>
          <div className="stress-controls__actions">
            {LAUNCH_COUNTS.map(count => (
              <button key={count} type="button" onClick={() => onLaunch(count)}>
                +{count}
              </button>
            ))}
            <button className="danger" type="button" onClick={onClear}>
              PURGE ACTIVE BEAMS
            </button>
          </div>
        </div>
      </section>

      <div className="terminal-hud__footer">
        <span><kbd>SPACE</kbd> RANDOM BEAM</span>
        <span><kbd>SHIFT</kbd> + <kbd>SPACE</kbd> FIXED PATH</span>
      </div>
    </aside>
  )
}
