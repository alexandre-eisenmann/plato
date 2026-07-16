const STRESS_COUNTS = [10, 50, 100]

export default function DeveloperTools({onClear, onLaunch, outputRef}) {
  return (
    <aside className="developer-tools">
      <output
        ref={outputRef}
        className="renderer-stats"
        aria-label="Renderer performance statistics"
      >
        Collecting renderer metrics…
      </output>
      <div className="stress-controls" aria-label="Beam stress test controls">
        <span>Launch beams</span>
        {STRESS_COUNTS.map(count => (
          <button key={count} type="button" onClick={() => onLaunch(count)}>
            {count}
          </button>
        ))}
        <button type="button" onClick={onClear}>Clear</button>
      </div>
    </aside>
  )
}
