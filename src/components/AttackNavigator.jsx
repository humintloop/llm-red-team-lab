import { Search, ChevronLeft, ChevronRight, Layers, Play, X } from 'lucide-react';

const filterLabels = [
  ['ALL', 'All'],
  ['AML.T0051.000', 'Direct injection'],
  ['AML.T0051.001', 'Indirect injection'],
  ['AML.T0054', 'Jailbreak'],
  ['AML.T0056', 'Prompt extraction'],
];

export default function AttackNavigator({
  C,
  clusters,
  activeClusterId,
  activeProbeId,
  filter,
  setFilter,
  query,
  setQuery,
  onSelectProbe,
  open,
  setOpen,
  selectedProbeIds = new Set(),
  onToggleSelect,
  onRunQueue,
}) {
  const totalProbes = clusters.reduce((n, cl) => n + cl.payloads.length, 0);
  const selectedCount = selectedProbeIds.size;
  const normalizedQuery = query.trim().toLowerCase();
  const visibleClusters = clusters
    .filter(cl => filter === 'ALL' || cl.code === filter || cl.id === filter)
    .map(cl => ({
      ...cl,
      payloads: cl.payloads.filter(p => {
        if (!normalizedQuery) return true;
        return [p.name, p.description, p.technique, p.difficulty, p.owasp, p.objective, p.failure_mode]
          .filter(Boolean).join(' ').toLowerCase().includes(normalizedQuery);
      }),
    }))
    .filter(cl => cl.payloads.length > 0);

  const buildQueue = () => {
    const queue = [];
    clusters.forEach(cl => {
      cl.payloads.forEach(p => {
        if (selectedProbeIds.has(p.id)) queue.push({ clusterId: cl.id, probeId: p.id });
      });
    });
    return queue;
  };

  if (!open) {
    return (
      <aside className="attack-nav" style={{
        width: 44, minWidth: 44, flexShrink: 0,
        borderRight: `1px solid ${C.border}`,
        background: 'rgba(10,12,22,.7)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: 14, gap: 4, overflow: 'hidden',
      }}>
        <button onClick={() => setOpen(true)} title="Browse probes" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          padding: '10px 0', width: '100%', background: 'transparent', border: 'none',
          cursor: 'pointer', color: C.text3,
        }}>
          <Layers size={16} color={C.text3} />
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase',
            writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: C.text3, marginTop: 2,
          }}>Probes</span>
          <span style={{ fontSize: 11, color: C.amber, fontWeight: 800 }}>{totalProbes}</span>
        </button>
        {selectedCount > 0 && (
          <div style={{
            marginTop: 4, width: 28, height: 28, borderRadius: '50%',
            background: C.teal, color: C.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 800,
          }}>{selectedCount}</div>
        )}
        <button onClick={() => setOpen(true)} style={{
          marginTop: 'auto', marginBottom: 14, padding: 8, background: 'transparent', border: 'none',
          cursor: 'pointer', color: C.text3,
        }}>
          <ChevronRight size={14} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="attack-nav" style={{
      width: 288, minWidth: 248, maxWidth: 340, flexShrink: 0,
      borderRight: `1px solid ${C.border}`,
      background: 'rgba(10,12,22,.7)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ padding: '11px 12px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
          <div style={{ fontSize: 11, color: C.text2, letterSpacing: 1.4, fontWeight: 800, textTransform: 'uppercase' }}>
            Probes
          </div>
          <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.text3, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, padding: 4 }}>
            <ChevronLeft size={13} /> Hide
          </button>
        </div>

        {/* Run Queue CTA */}
        {selectedCount > 0 && onRunQueue && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 9 }}>
            <button
              onClick={() => { onRunQueue(buildQueue()); setOpen(false); }}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '8px 10px', background: C.teal, color: C.ink,
                border: 'none', borderRadius: 3, fontSize: 12, fontWeight: 800, letterSpacing: .8,
                cursor: 'pointer',
              }}
            >
              <Play size={11} fill={C.ink} /> RUN QUEUE ({selectedCount})
            </button>
            <button
              onClick={() => [...selectedProbeIds].forEach(id => onToggleSelect(id))}
              title="Clear selection"
              style={{ padding: '8px 10px', background: 'transparent', border: `1px solid ${C.borderHi}`, borderRadius: 3, cursor: 'pointer', color: C.text3 }}
            >
              <X size={12} />
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 9 }}>
          {filterLabels.map(([id, label]) => (
            <button key={id} onClick={() => setFilter(id)} style={{
              padding: '4px 7px',
              background: filter === id ? C.amberBg : 'transparent',
              border: `1px solid ${filter === id ? C.amber : C.borderHi}`,
              color: filter === id ? C.amber : C.text3,
              borderRadius: 2, fontSize: 11, fontWeight: 700, cursor: 'pointer',
            }}>
              {label}
            </button>
          ))}
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 3, padding: '6px 8px' }}>
          <Search size={12} color={C.text3} />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="search probes, techniques, signals"
            style={{ width: '100%', minWidth: 0, background: 'transparent', border: 'none', color: C.text1, fontSize: 12 }} />
        </label>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {visibleClusters.map(cluster => {
          const clusterActive = activeClusterId === cluster.id;
          const color = C[cluster.colorKey] || C.amber;
          const allSelected = cluster.payloads.every(p => selectedProbeIds.has(p.id));
          const someSelected = cluster.payloads.some(p => selectedProbeIds.has(p.id));
          return (
            <section key={cluster.id} style={{ borderBottom: `1px solid ${C.border}` }}>
              <div style={{ padding: '9px 12px 5px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 10, color, letterSpacing: 1, fontWeight: 800, fontFamily: C.mono }}>{cluster.code}</span>
                    <span style={{ fontSize: 10, color: C.text3 }}>{cluster.payloads.length}</span>
                  </div>
                  <div style={{ fontSize: 13, color: clusterActive ? C.text1 : C.text2, fontWeight: 600, marginTop: 2 }}>{cluster.name}</div>
                </div>
                {onToggleSelect && (
                  <button
                    onClick={() => cluster.payloads.forEach(p => {
                      if (allSelected ? true : !selectedProbeIds.has(p.id)) onToggleSelect(p.id);
                    })}
                    title={allSelected ? 'Deselect cluster' : 'Select all in cluster'}
                    style={{
                      padding: '3px 7px', fontSize: 10, fontWeight: 700, borderRadius: 2, cursor: 'pointer',
                      background: someSelected ? `${color}22` : 'transparent',
                      border: `1px solid ${someSelected ? color : C.borderHi}`,
                      color: someSelected ? color : C.text3, flexShrink: 0,
                    }}
                  >
                    {allSelected ? 'deselect' : 'select all'}
                  </button>
                )}
              </div>
              <div style={{ display: 'grid', gap: 2, padding: '0 8px 8px' }}>
                {cluster.payloads.map((payload, index) => {
                  const active = activeProbeId === payload.id;
                  const selected = selectedProbeIds.has(payload.id);
                  return (
                    <div key={payload.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      {onToggleSelect && (
                        <button
                          onClick={() => onToggleSelect(payload.id)}
                          style={{
                            flexShrink: 0, marginTop: 8, width: 16, height: 16, borderRadius: 3,
                            background: selected ? C.teal : 'transparent',
                            border: `1.5px solid ${selected ? C.teal : C.borderHi}`,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          {selected && <span style={{ fontSize: 10, color: C.ink, fontWeight: 900, lineHeight: 1 }}>✓</span>}
                        </button>
                      )}
                      <button onClick={() => { onSelectProbe(cluster.id, payload.id); setOpen(false); }} style={{
                        flex: 1, textAlign: 'left',
                        background: active ? `${color}14` : 'transparent',
                        border: `1px solid ${active ? color : 'transparent'}`,
                        borderLeft: `3px solid ${active ? color : C.border}`,
                        borderRadius: 3, padding: '7px 9px', cursor: 'pointer',
                      }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{ fontSize: 10, color: active ? color : C.text3, fontFamily: C.mono }}>{String(index + 1).padStart(2, '0')}</span>
                          <span style={{ fontSize: 12.5, color: active ? C.text1 : C.text2, fontWeight: active ? 700 : 500 }}>{payload.name}</span>
                        </div>
                        <div style={{ fontSize: 11, color: C.text3, marginTop: 2, lineHeight: 1.35 }}>
                          {payload.difficulty?.toUpperCase()} · {payload.description}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </aside>
  );
}
