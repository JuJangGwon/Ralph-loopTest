import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnelStore } from '../store/funnelStore.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

export default function Result() {
  const navigate = useNavigate();
  const name = useFunnelStore((s) => s.name);
  const region = useFunnelStore((s) => s.region);
  const job = useFunnelStore((s) => s.job);
  const income = useFunnelStore((s) => s.income);
  const reset = useFunnelStore((s) => s.reset);

  const [status, setStatus] = useState('loading');
  const [recommendations, setRecommendations] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchRecommendations = useCallback(async () => {
    setStatus('loading');
    setErrorMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          region,
          job,
          income: Number(income),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `요청 실패 (${res.status})`);
      }
      const data = await res.json();
      setRecommendations(Array.isArray(data.recommendations) ? data.recommendations : []);
      setStatus('done');
    } catch (err) {
      setErrorMessage(err.message || '추천을 불러오지 못했어요');
      setStatus('error');
    }
  }, [name, region, job, income]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const handleHome = () => {
    reset();
    navigate('/');
  };

  const pageStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'flex-start',
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
    gap: '16px',
    padding: '32px 24px',
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
    boxSizing: 'border-box',
  };
  const titleStyle = {
    margin: 0,
    fontSize: 'clamp(20px, 5vw, 24px)',
    fontWeight: 700,
    color: '#0f172a',
  };
  const subtitleStyle = {
    margin: 0,
    fontSize: '14px',
    color: '#475569',
    lineHeight: 1.5,
  };
  const itemStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '16px',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    background: '#ffffff',
  };
  const itemHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  };
  const itemNameStyle = {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: '#0f172a',
    lineHeight: 1.35,
  };
  const scoreBadgeStyle = {
    flexShrink: 0,
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: 700,
    color: '#1d4ed8',
    background: '#dbeafe',
    borderRadius: '999px',
  };
  const itemSummaryStyle = {
    margin: 0,
    fontSize: '14px',
    color: '#475569',
    lineHeight: 1.5,
  };
  const applyLinkStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '4px',
    padding: '10px 14px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#ffffff',
    background: '#2563eb',
    borderRadius: '10px',
    textDecoration: 'none',
  };
  const baseButton = {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    fontWeight: 600,
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
  };
  const homeButtonStyle = {
    ...baseButton,
    color: '#0f172a',
    background: '#e5e7eb',
  };
  const retryButtonStyle = {
    ...baseButton,
    color: '#ffffff',
    background: '#2563eb',
    marginBottom: '8px',
  };
  const spinnerStyle = {
    width: '32px',
    height: '32px',
    border: '3px solid #e5e7eb',
    borderTopColor: '#2563eb',
    borderRadius: '50%',
    animation: 'rb-spin 0.8s linear infinite',
  };
  const loadingWrapStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '24px 0',
    color: '#475569',
    fontSize: '14px',
  };
  const errorBoxStyle = {
    padding: '12px 14px',
    fontSize: '14px',
    color: '#991b1b',
    background: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: '10px',
  };
  const emptyStyle = {
    margin: 0,
    padding: '24px 0',
    fontSize: '15px',
    color: '#475569',
    textAlign: 'center',
  };

  return (
    <main data-route="/result" style={pageStyle}>
      <style>{`@keyframes rb-spin { to { transform: rotate(360deg); } }`}</style>
      <section style={cardStyle}>
        <h1 style={titleStyle}>추천 결과</h1>
        {name && (
          <p style={subtitleStyle}>
            {name}님께 어울리는 청년 혜택을 찾았어요.
          </p>
        )}

        {status === 'loading' && (
          <div style={loadingWrapStyle} role="status" aria-live="polite">
            <div style={spinnerStyle} aria-hidden="true" />
            <span>추천을 불러오는 중...</span>
          </div>
        )}

        {status === 'error' && (
          <>
            <div style={errorBoxStyle} role="alert">
              {errorMessage}
            </div>
            <button type="button" onClick={fetchRecommendations} style={retryButtonStyle}>
              다시 시도
            </button>
          </>
        )}

        {status === 'done' && recommendations.length === 0 && (
          <p style={emptyStyle}>조건에 맞는 혜택을 찾지 못했어요</p>
        )}

        {status === 'done' && recommendations.length > 0 && (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recommendations.map((item) => (
              <li key={item.id} style={itemStyle}>
                <div style={itemHeaderStyle}>
                  <h2 style={itemNameStyle}>{item.name}</h2>
                  <span style={scoreBadgeStyle} aria-label={`점수 ${item.score}`}>
                    {item.score}점
                  </span>
                </div>
                {item.summary && <p style={itemSummaryStyle}>{item.summary}</p>}
                {item.applyUrl && (
                  <a
                    href={item.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={applyLinkStyle}
                  >
                    신청하러 가기
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}

        <button type="button" onClick={handleHome} style={homeButtonStyle}>
          처음으로
        </button>
      </section>
    </main>
  );
}
