import { useState, useRef, useCallback } from 'react';
import { ZoomIn, ZoomOut, RefreshCw, X, Move } from 'lucide-react';
import { topologyNodes, topologyEdges } from '../data/mockData';

// Colors per type
const NODE_COLOR = {
  pc:     { fill: '#1e90ff', stroke: '#1e90ff' },
  switch: { fill: '#a855f7', stroke: '#a855f7' },
  router: { fill: '#00d4ff', stroke: '#00d4ff' },
  server: { fill: '#f59e0b', stroke: '#f59e0b' },
  ap:     { fill: '#22c55e', stroke: '#22c55e' },
  cloud:  { fill: '#f97316', stroke: '#f97316' },
};

const EDGE_COLOR = { lan: '#1e90ff', man: '#a855f7', wan: '#f59e0b' };

const NodeIcon = ({ type, x, y, size = 16 }) => {
  const cx = x - size / 2;
  const cy = y - size / 2;
  const color = '#0d1f3c';
  if (type === 'switch')  return <svg x={cx} y={cy} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><path d="M4 8h16M4 16h16M8 4v4M16 4v4M8 16v4M16 16v4"/></svg>;
  if (type === 'router')  return <svg x={cx} y={cy} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20"/></svg>;
  if (type === 'server')  return <svg x={cx} y={cy} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><circle cx="6" cy="6" r="1" fill={color}/><circle cx="6" cy="18" r="1" fill={color}/></svg>;
  if (type === 'ap')      return <svg x={cx} y={cy} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>;
  if (type === 'cloud')   return <svg x={cx} y={cy} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>;
  return <svg x={cx} y={cy} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>;
};

// Area background regions
const AREAS = [
  { label: 'CSE LAN',    x: 40,  y: 80,  w: 350, h: 340, color: '#1e90ff' },
  { label: 'ECE LAN',    x: 40,  y: 470, w: 350, h: 200, color: '#22c55e' },
  { label: 'MAN Core',   x: 480, y: 180, w: 270, h: 440, color: '#a855f7' },
  { label: 'Data Center',x: 820, y: 280, w: 250, h: 170, color: '#f59e0b' },
  { label: 'WAN',        x: 820, y: 460, w: 250, h: 110, color: '#f97316' },
];

export default function Topology({ addToast }) {
  const [selected, setSelected] = useState(null);
  const [scale, setScale]       = useState(0.85);
  const [pan, setPan]           = useState({ x: 0, y: 0 });
  const [panMode, setPanMode]   = useState(false);
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const svgRef = useRef(null);

  const selNode  = selected ? topologyNodes.find(n => n.id === selected) : null;
  const selEdges = selected
    ? topologyEdges.filter(e => e.source === selected || e.target === selected)
    : [];

  const zoom = (delta) => setScale(s => Math.max(0.3, Math.min(2.0, +(s + delta).toFixed(2))));

  const handleMouseDown = useCallback((e) => {
    if (!panMode) return;
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    e.preventDefault();
  }, [panMode, pan]);

  const handleMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({ x: dragStart.current.panX + dx, y: dragStart.current.panY + dy });
  }, []);

  const handleMouseUp = useCallback(() => { dragging.current = false; }, []);

  const handleReset = () => { setScale(0.85); setSelected(null); setPan({ x: 0, y: 0 }); };

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setScale(s => Math.max(0.3, Math.min(2.0, +(s + delta).toFixed(2))));
  }, []);

  return (
    <>
      {/* Legend + Controls */}
      <div className="section-header" style={{ marginBottom: 12 }}>
        <div>
          <div className="section-title">Network Topology Map</div>
          <div className="section-subtitle">LAN • MAN • WAN — click a node to inspect • scroll to zoom</div>
        </div>
        <div className="section-actions">
          {Object.entries(NODE_COLOR).map(([t, c]) => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.fill, display: 'inline-block' }} />
              {t}
            </span>
          ))}
          <button
            className={`btn btn-sm ${panMode ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setPanMode(v => !v)}
            title="Toggle pan mode"
          >
            <Move size={14} /> {panMode ? 'Pan On' : 'Pan'}
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => zoom(-0.1)}><ZoomOut size={14} /></button>
          <button className="btn btn-outline btn-sm" onClick={() => zoom(0.1)}><ZoomIn size={14} /></button>
          <button className="btn btn-outline btn-sm" onClick={handleReset}>
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </div>

      <div
        className="topology-canvas"
        style={{ height: 680, overflow: 'hidden', cursor: panMode ? (dragging.current ? 'grabbing' : 'grab') : 'default' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg
          ref={svgRef}
          width="100%" height="100%"
          viewBox="0 0 1120 720"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: 'top left',
            transition: dragging.current ? 'none' : 'transform 0.15s ease',
            userSelect: 'none',
          }}
        >
          {/* Area backgrounds */}
          {AREAS.map(a => (
            <g key={a.label}>
              <rect x={a.x} y={a.y} width={a.w} height={a.h}
                fill={a.color} fillOpacity={0.04} stroke={a.color} strokeOpacity={0.2} strokeWidth={1}
                rx={12} ry={12} />
              <text x={a.x + 10} y={a.y + 18} fontSize={9} fill={a.color} opacity={0.6}
                textAnchor="start" fontWeight="700" letterSpacing="1.5">
                {a.label.toUpperCase()}
              </text>
            </g>
          ))}

          {/* Edges */}
          {topologyEdges.map(e => {
            const src = topologyNodes.find(n => n.id === e.source);
            const tgt = topologyNodes.find(n => n.id === e.target);
            if (!src || !tgt) return null;
            const isHighlighted = selEdges.some(se => se.id === e.id);
            return (
              <line
                key={e.id}
                x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                stroke={isHighlighted ? '#fff' : EDGE_COLOR[e.type] || '#1a3050'}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                strokeOpacity={isHighlighted ? 1 : 0.5}
                strokeDasharray={e.type === 'wan' ? '6 3' : undefined}
              />
            );
          })}

          {/* Edge BW labels (only highlighted) */}
          {topologyEdges.map(e => {
            const src = topologyNodes.find(n => n.id === e.source);
            const tgt = topologyNodes.find(n => n.id === e.target);
            if (!src || !tgt) return null;
            const mx = (src.x + tgt.x) / 2;
            const my = (src.y + tgt.y) / 2;
            if (!selEdges.some(se => se.id === e.id)) return null;
            return (
              <g key={`lbl-${e.id}`}>
                <rect x={mx - 26} y={my - 10} width={52} height={18} fill="#0d1f3c" stroke="#1a3050" strokeWidth={1} rx={4} />
                <text x={mx} y={my + 3} textAnchor="middle" fontSize={9} fill="#94a3b8">{e.bw}</text>
              </g>
            );
          })}

          {/* Nodes */}
          {topologyNodes.map(node => {
            const c = NODE_COLOR[node.type] || NODE_COLOR.pc;
            const isSelected = selected === node.id;
            return (
              <g
                key={node.id}
                className="topo-node"
                onClick={(e) => { if (!panMode) { e.stopPropagation(); setSelected(node.id === selected ? null : node.id); } }}
              >
                {/* Glow ring when selected */}
                {isSelected && (
                  <circle cx={node.x} cy={node.y} r={28} fill={c.fill} fillOpacity={0.08} stroke={c.stroke} strokeWidth={1} strokeOpacity={0.4} />
                )}
                <circle
                  cx={node.x} cy={node.y} r={isSelected ? 22 : 18}
                  fill={c.fill} fillOpacity={isSelected ? 0.9 : 0.15}
                  stroke={c.stroke} strokeWidth={isSelected ? 2.5 : 1.5}
                />
                <NodeIcon type={node.type} x={node.x} y={node.y} size={15} />
                <text x={node.x} y={node.y + 34} textAnchor="middle" fontSize={9.5}
                  fill={isSelected ? '#e2e8f0' : '#94a3b8'} fontWeight={isSelected ? '700' : '400'}>
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Node detail panel */}
        {selNode && (
          <div className="node-detail-panel">
            <div className="node-detail-title">
              <span>{selNode.label}</span>
              <button
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                onClick={() => setSelected(null)}
              >
                <X size={14} />
              </button>
            </div>
            {[
              ['Type',    selNode.type],
              ['IP',      selNode.ip],
              ['Area',    selNode.area],
              ['Links',   selEdges.length],
            ].map(([k, v]) => (
              <div key={k} className="node-detail-row">
                <span className="key">{k}</span>
                <span className="val">{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
                Connected Links
              </div>
              {selEdges.map(e => {
                const other = e.source === selNode.id ? e.target : e.source;
                return (
                  <div key={e.id} style={{ fontSize: 11, color: 'var(--text-secondary)', padding: '3px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: EDGE_COLOR[e.type], fontWeight: 600 }}>{e.type.toUpperCase()}</span>
                    {' '}{other} ({e.bw})
                  </div>
                );
              })}
            </div>
            {/* Zoom indicator */}
            <div style={{ marginTop: 14, fontSize: 10, color: 'var(--text-muted)', textAlign: 'center' }}>
              Zoom: {Math.round(scale * 100)}%
            </div>
          </div>
        )}

        {/* Zoom level indicator (bottom left) */}
        <div style={{
          position: 'absolute', bottom: 12, left: 12,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 6, padding: '4px 10px', fontSize: 11, color: 'var(--text-muted)',
          fontFamily: 'var(--text-mono)',
        }}>
          {Math.round(scale * 100)}% {panMode && '• Pan mode'}
        </div>
      </div>

      {/* Edge List */}
      <div style={{ marginTop: 20 }}>
        <div className="section-header" style={{ marginBottom: 12 }}>
          <div className="section-title">Network Links ({topologyEdges.length})</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Source</th><th>Target</th><th>Bandwidth</th><th>Type</th></tr>
            </thead>
            <tbody>
              {topologyEdges.map(e => (
                <tr key={e.id}>
                  <td className="mono" style={{ color: 'var(--text-muted)' }}>{e.id}</td>
                  <td style={{ color: 'var(--text-primary)' }}>{e.source}</td>
                  <td style={{ color: 'var(--text-primary)' }}>{e.target}</td>
                  <td className="mono">{e.bw}</td>
                  <td>
                    <span style={{ color: EDGE_COLOR[e.type], fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {e.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
