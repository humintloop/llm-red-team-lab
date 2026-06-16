import { Download, FileText, Trash2 } from 'lucide-react';
import { getVerdictColor, getVerdictLabel } from './VerdictBanner';

export default function FindingsReport({
  C,
  findings,
  exportFindings,
  exportReport,
  exportAuditBrief,
  clearFindings,
  children,
}) {
  const counts = findings.reduce((acc, finding) => {
    const key = finding.verdict || 'REVIEW';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '10px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span style={{ fontSize: 13, color: C.text2, letterSpacing: 1.5, fontWeight: 700, flex: 1 }}>
          REPORT · {findings.length} FINDING{findings.length !== 1 ? 'S' : ''}
        </span>
        {findings.length > 0 && (
          <>
            <button onClick={exportFindings} style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px',
              background: C.surface, border: `1px solid ${C.borderHi}`, color: C.text2,
              fontSize: 14, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', borderRadius: 2,
            }}>
              <Download size={11} /> EXPORT JSON
            </button>
            <button onClick={exportReport} style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px',
              background: C.amberBg, border: `1px solid ${C.amber}40`, color: C.amber,
              fontSize: 14, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', borderRadius: 2,
            }}>
              <FileText size={11} /> EXPORT REPORT
            </button>
            <button onClick={exportAuditBrief} style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px',
              background: C.amberBg, border: `1px solid ${C.amber}70`, color: C.amber,
              fontSize: 14, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', borderRadius: 2,
            }}>
              <FileText size={11} /> AUDIT BRIEF HTML
            </button>
            <button onClick={clearFindings} style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px',
              background: C.surface, border: `1px solid ${C.borderHi}`, color: C.text3,
              fontSize: 14, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', borderRadius: 2,
            }}>
              <Trash2 size={11} /> CLEAR
            </button>
          </>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ background: C.amberBg, border: `1px solid ${C.amber}40`, color: C.text2, padding: '8px 10px', fontSize: 13, lineHeight: 1.45, borderRadius: 2 }}>
          Findings are stored in this browser only. Export JSON or Markdown before clearing site data, changing browsers, or relying on this as a long-term record.
        </div>

        {findings.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>
            {['SUCCESS', 'PARTIAL', 'FAILURE', 'REVIEW'].map(verdict => {
              const color = getVerdictColor(verdict, C);
              return (
                <div key={verdict} style={{ background: C.panel, border: `1px solid ${C.border}`, borderTop: `2px solid ${color}`, padding: '10px 12px', borderRadius: 3 }}>
                  <div style={{ fontSize: 22, color, fontWeight: 900 }}>{counts[verdict] || 0}</div>
                  <div style={{ fontSize: 11, color: C.text3, letterSpacing: 1 }}>{getVerdictLabel(verdict)}</div>
                </div>
              );
            })}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
