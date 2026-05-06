import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

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
  const titleStyle = {
    margin: 0,
    fontSize: 'clamp(24px, 6vw, 32px)',
    fontWeight: 700,
    color: '#0f172a',
    lineHeight: 1.25,
  };
  const descStyle = {
    margin: 0,
    fontSize: 'clamp(14px, 4vw, 16px)',
    color: '#475569',
    lineHeight: 1.5,
  };
  const buttonStyle = {
    marginTop: '8px',
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#ffffff',
    background: '#2563eb',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
  };

  return (
    <main data-route="/" style={pageStyle}>
      <section style={cardStyle}>
        <h1 style={titleStyle}>청년 혜택 추천</h1>
        <p style={descStyle}>
          이름·지역·직업·소득만 입력하면 나에게 맞는 청년 정부 혜택을 추천해 드려요.
        </p>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => navigate('/funnel/name')}
        >
          시작하기
        </button>
      </section>
    </main>
  );
}
