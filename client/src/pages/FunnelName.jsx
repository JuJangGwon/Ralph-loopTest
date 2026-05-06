import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar.jsx';
import { useFunnelStore } from '../store/funnelStore.js';

export default function FunnelName() {
  const navigate = useNavigate();
  const name = useFunnelStore((s) => s.name);
  const setField = useFunnelStore((s) => s.setField);

  const trimmed = name.trim();
  const canProceed = trimmed.length > 0;

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
  const buttonStyle = {
    marginTop: '8px',
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#ffffff',
    background: canProceed ? '#2563eb' : '#94a3b8',
    border: 'none',
    borderRadius: '12px',
    cursor: canProceed ? 'pointer' : 'not-allowed',
  };

  const handleNext = () => {
    if (!canProceed) return;
    navigate('/funnel/region');
  };

  return (
    <main data-route="/funnel/name" style={pageStyle}>
      <section style={cardStyle}>
        <ProgressBar current={1} total={4} />
        <label style={labelStyle}>
          이름
          <input
            type="text"
            value={name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="이름을 입력하세요"
            autoFocus
            style={inputStyle}
          />
        </label>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
          style={buttonStyle}
        >
          다음
        </button>
      </section>
    </main>
  );
}
