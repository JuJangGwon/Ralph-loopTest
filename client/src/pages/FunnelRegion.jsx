import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar.jsx';
import { useFunnelStore } from '../store/funnelStore.js';

const REGIONS = [
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '강원특별자치도',
  '충청북도',
  '충청남도',
  '전북특별자치도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도',
];

export default function FunnelRegion() {
  const navigate = useNavigate();
  const region = useFunnelStore((s) => s.region);
  const setField = useFunnelStore((s) => s.setField);

  const canProceed = region.length > 0;

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
  const selectStyle = {
    width: '100%',
    padding: '12px 14px',
    fontSize: '16px',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    background: '#ffffff',
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

  const handleBack = () => navigate('/funnel/name');
  const handleNext = () => {
    if (!canProceed) return;
    navigate('/funnel/job');
  };

  return (
    <main data-route="/funnel/region" style={pageStyle}>
      <section style={cardStyle}>
        <ProgressBar current={2} total={4} />
        <label style={labelStyle}>
          거주 지역
          <select
            value={region}
            onChange={(e) => setField('region', e.target.value)}
            style={selectStyle}
          >
            <option value="" disabled>
              시/도를 선택하세요
            </option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
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
