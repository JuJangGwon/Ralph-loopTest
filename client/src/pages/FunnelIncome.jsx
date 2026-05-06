import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar.jsx';
import { useFunnelStore } from '../store/funnelStore.js';

const isValidIncome = (value) => /^\d+$/.test(value);

export default function FunnelIncome() {
  const navigate = useNavigate();
  const income = useFunnelStore((s) => s.income);
  const setField = useFunnelStore((s) => s.setField);

  const canProceed = isValidIncome(income);

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
  const labelStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#0f172a',
  };
  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    fontSize: '16px',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
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
  const submitButtonStyle = {
    ...baseButton,
    color: '#ffffff',
    background: canProceed ? '#2563eb' : '#94a3b8',
    cursor: canProceed ? 'pointer' : 'not-allowed',
  };

  const handleChange = (e) => {
    const raw = e.target.value;
    if (raw === '' || /^\d+$/.test(raw)) {
      setField('income', raw);
    }
  };
  const handleBack = () => navigate('/funnel/job');
  const handleSubmit = () => {
    if (!canProceed) return;
    navigate('/result');
  };

  return (
    <main data-route="/funnel/income" style={pageStyle}>
      <section style={cardStyle}>
        <ProgressBar current={4} total={4} />
        <label style={labelStyle}>
          연소득 (만원)
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={income}
            onChange={handleChange}
            placeholder="예: 2400"
            autoFocus
            style={inputStyle}
          />
        </label>
        <div style={actionsStyle}>
          <button type="button" onClick={handleBack} style={backButtonStyle}>
            이전
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canProceed}
            style={submitButtonStyle}
          >
            추천받기
          </button>
        </div>
      </section>
    </main>
  );
}
