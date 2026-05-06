import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar.jsx';
import { useFunnelStore } from '../store/funnelStore.js';

const JOB_OPTIONS = ['대학생', '취업준비생', '재직자', '창업자', '무직'];

export default function FunnelJob() {
  const navigate = useNavigate();
  const job = useFunnelStore((s) => s.job);
  const setField = useFunnelStore((s) => s.setField);

  const canProceed = job.length > 0;

  const pageStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    background: '#f9fafb',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    boxSizing: 'border-box',
  };
  const cardStyle = {
    width: '100%',
    maxWidth: '480px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '32px 24px',
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
    boxSizing: 'border-box',
  };
  const groupLabelStyle = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#0f172a',
  };
  const optionsStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };
  const optionStyle = (selected) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    fontSize: '16px',
    border: `1px solid ${selected ? '#2563eb' : '#cbd5e1'}`,
    background: selected ? '#eff6ff' : '#ffffff',
    borderRadius: '12px',
    cursor: 'pointer',
    boxSizing: 'border-box',
  });
  const radioStyle = {
    margin: 0,
    accentColor: '#2563eb',
  };
  const actionsStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  };
  const baseButton = {
    flex: 1,
    padding: '14px 16px',
    fontSize: '16px',
    fontWeight: 600,
    border: 'none',
    borderRadius: '12px',
  };
  const backButtonStyle = {
    ...baseButton,
    color: '#0f172a',
    background: '#e5e7eb',
    cursor: 'pointer',
  };
  const nextButtonStyle = {
    ...baseButton,
    color: '#ffffff',
    background: canProceed ? '#2563eb' : '#94a3b8',
    cursor: canProceed ? 'pointer' : 'not-allowed',
  };

  const handleBack = () => navigate('/funnel/region');
  const handleNext = () => {
    if (!canProceed) return;
    navigate('/funnel/income');
  };

  return (
    <main data-route="/funnel/job" style={pageStyle}>
      <section style={cardStyle}>
        <ProgressBar current={3} total={4} />
        <fieldset style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <legend style={groupLabelStyle}>직업</legend>
          <div role="radiogroup" style={optionsStyle}>
            {JOB_OPTIONS.map((option) => {
              const selected = job === option;
              return (
                <label key={option} style={optionStyle(selected)}>
                  <input
                    type="radio"
                    name="job"
                    value={option}
                    checked={selected}
                    onChange={(e) => setField('job', e.target.value)}
                    style={radioStyle}
                  />
                  {option}
                </label>
              );
            })}
          </div>
        </fieldset>
        <div style={actionsStyle}>
          <button type="button" onClick={handleBack} style={backButtonStyle}>
            이전
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed}
            style={nextButtonStyle}
          >
            다음
          </button>
        </div>
      </section>
    </main>
  );
}
