const STEP_LABELS = ['이름', '거주 지역', '직업', '연소득'];

export default function ProgressBar({ current, total }) {
  const safeTotal = Math.max(1, Number(total) || 1);
  const safeCurrent = Math.min(Math.max(1, Number(current) || 1), safeTotal);
  const ratio = safeCurrent / safeTotal;
  const stepLabel = STEP_LABELS[safeCurrent - 1] ?? '';
  const label = `${safeCurrent}/${safeTotal} ${stepLabel}`.trim();

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };
  const trackStyle = {
    position: 'relative',
    height: '8px',
    background: '#e5e7eb',
    borderRadius: '999px',
    overflow: 'hidden',
  };
  const fillStyle = {
    width: `${ratio * 100}%`,
    height: '100%',
    background: '#2563eb',
    transition: 'width 200ms ease-out',
  };
  const stepsRowStyle = {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  };
  const labelStyle = {
    fontSize: '14px',
    color: '#374151',
  };

  const dotStyle = (state) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    fontSize: '12px',
    fontWeight: 600,
    color: state === 'pending' ? '#9ca3af' : '#fff',
    background:
      state === 'completed' ? '#22c55e' : state === 'active' ? '#2563eb' : '#e5e7eb',
    border: state === 'active' ? '2px solid #1d4ed8' : '2px solid transparent',
  });

  const stateFor = (idx) => {
    const step = idx + 1;
    if (step < safeCurrent) return 'completed';
    if (step === safeCurrent) return 'active';
    return 'pending';
  };

  return (
    <div data-testid="progress-bar" style={containerStyle}>
      <div style={stepsRowStyle}>
        {Array.from({ length: safeTotal }, (_, idx) => {
          const state = stateFor(idx);
          return (
            <span
              key={idx}
              data-step={idx + 1}
              data-state={state}
              style={dotStyle(state)}
              aria-label={`step ${idx + 1} ${state}`}
            >
              {state === 'completed' ? '✓' : idx + 1}
            </span>
          );
        })}
        <span style={{ ...labelStyle, marginLeft: '8px' }}>{label}</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={safeCurrent}
        aria-valuemin={1}
        aria-valuemax={safeTotal}
        aria-label={label}
        style={trackStyle}
      >
        <div style={fillStyle} />
      </div>
    </div>
  );
}
