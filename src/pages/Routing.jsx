import { useState } from 'react';
import { Share2, Play } from 'lucide-react';
import { routingTable } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';

const PROTOCOLS = [
  {
    name: 'OSPF',
    fullname: 'Open Shortest Path First',
    type: 'Link-State',
    algorithm: 'Dijkstra SPF',
    metric: 'Cost (bandwidth-based)',
    convergence: 'Fast (~2s)',
    scalability: 'High (Areas)',
    areas: ['Area 0 (Backbone)', 'Area 1 (CSE)', 'Area 2 (ECE)'],
    color: '#1e90ff',
  },
  {
    name: 'RIP',
    fullname: 'Routing Information Protocol v2',
    type: 'Distance-Vector',
    algorithm: 'Bellman-Ford',
    metric: 'Hop Count (max 15)',
    convergence: 'Slow (~30s)',
    scalability: 'Low (flat)',
    areas: ['Global Table'],
    color: '#a855f7',
  },
  {
    name: 'BGP',
    fullname: 'Border Gateway Protocol v4',
    type: 'Path-Vector',
    algorithm: 'Best Path Selection',
    metric: 'AS-Path / Policy',
    convergence: 'Variable',
    scalability: 'Very High',
    areas: ['AS 65001 (Campus)', 'AS 65002 (ISP)'],
    color: '#f59e0b',
  },
];

const SPF_STEPS = [
  '> OSPF SPF Recalculation triggered…',
  '> Processing LSA from North-Campus-Core (10.0.0.1)',
  '> Processing LSA from South-Campus-Core (10.0.0.2)',
  '> Calculating shortest path tree (Dijkstra)…',
  '  Node: Campus-Aggregation-Switch — cost 5',
  '  Node: DataCenter-Switch — cost 15',
  '  Node: Campus-Web-Portal — cost 25',
  '  Node: Campus-DNS — cost 25',
  '  Node: Campus-Edge-Router — cost 20',
  '> SPF calculation complete.',
  '> Installing 6 routes into RIB…',
  '> OSPF Area 0 fully converged ✓',
];

export default function Routing({ addToast }) {
  const [spfLines, setSpfLines] = useState([]);
  const [running, setRunning]   = useState(false);

  const runSPF = () => {
    if (running) return;
    setRunning(true);
    setSpfLines([]);
    let i = 0;
    const iv = setInterval(() => {
      setSpfLines(prev => [...prev, SPF_STEPS[i]]);
      i++;
      if (i >= SPF_STEPS.length) {
        clearInterval(iv);
        setRunning(false);
        addToast('OSPF SPF recalculation complete — 6 routes installed.', 'success');
      }
    }, 280);
  };

  return (
    <>
      {/* Protocol Cards */}
      <div className="protocol-grid">
        {PROTOCOLS.map(p => (
          <div key={p.name} className="protocol-card" style={{ '--proto-color': p.color }}>
            <div className="proto-name" style={{ color: p.color }}>{p.name}</div>
            <div className="proto-fullname">{p.fullname}</div>
            {[
              ['Type',          p.type],
              ['Algorithm',     p.algorithm],
              ['Metric',        p.metric],
              ['Convergence',   p.convergence],
              ['Scalability',   p.scalability],
            ].map(([k, v]) => (
              <div key={k} className="proto-detail">
                <span className="k">{k}</span>
                <span className="v">{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 12 }}>
              {p.areas.map(a => (
                <span key={a} style={{
                  display: 'inline-block', fontSize: 10, padding: '2px 8px',
                  background: `${p.color}15`, border: `1px solid ${p.color}30`,
                  color: p.color, borderRadius: 20, marginRight: 4, marginBottom: 4,
                  fontWeight: 600, letterSpacing: '0.5px',
                }}>{a}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Routing Table */}
      <div className="section-header" style={{ marginBottom: 12 }}>
        <div>
          <div className="section-title">Campus Routing Table</div>
          <div className="section-subtitle">Static simulation — OSPF + RIP routes</div>
        </div>
      </div>
      <div className="table-wrap" style={{ marginBottom: 24 }}>
        <table>
          <thead>
            <tr>
              <th>Destination</th>
              <th>Next Hop</th>
              <th>Interface</th>
              <th>Metric</th>
              <th>Protocol</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {routingTable.map((r, i) => (
              <tr key={i}>
                <td className="mono" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{r.destination}</td>
                <td className="mono">{r.nextHop}</td>
                <td><span style={{ fontFamily: 'var(--text-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{r.iface}</span></td>
                <td className="mono">{r.metric}</td>
                <td>
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.5px',
                    color: r.protocol === 'OSPF' ? '#1e90ff' : '#a855f7',
                  }}>{r.protocol}</span>
                </td>
                <td><StatusBadge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SPF Animation */}
      <div className="section-header" style={{ marginBottom: 12 }}>
        <div>
          <div className="section-title">OSPF SPF Recalculation</div>
          <div className="section-subtitle">Simulate Dijkstra shortest-path-first algorithm</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={runSPF} disabled={running}>
          <Play size={14} /> {running ? 'Running…' : 'Run SPF'}
        </button>
      </div>
      <div className="spf-terminal">
        {spfLines.length === 0 && <span style={{ color: '#4a6080' }}>Click "Run SPF" to simulate OSPF recalculation…</span>}
        {spfLines.map((line, i) => (
          <div key={i} className="spf-line" style={{ color: line.startsWith('>') ? '#22c55e' : '#94a3b8' }}>
            {line}
          </div>
        ))}
        {running && <span className="spf-cursor" />}
      </div>
    </>
  );
}
