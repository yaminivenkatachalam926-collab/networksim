import { useState, useEffect, useRef } from 'react';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { monitoringTimeSeries, links } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

const CHART_STYLE = {
  contentStyle: {
    background: '#0d1f3c', border: '1px solid #1a3050',
    borderRadius: 8, fontSize: 12, color: '#e2e8f0',
  },
};

// Generate a fresh data point
function nextPoint(prev) {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return {
    time: `${hh}:${mm}:${ss}`,
    throughput: +(3.0 + Math.random() * 3.5).toFixed(2),
    packets:    Math.floor(70 + Math.random() * 60),
    latency:    Math.floor(25 + Math.random() * 40),
    bandwidth:  +(2.5 + Math.random() * 3.5).toFixed(2),
  };
}

function Trend({ curr, prev }) {
  if (prev == null) return <Minus size={13} style={{ color: '#4a6080' }} />;
  if (curr > prev)  return <TrendingUp size={13} style={{ color: '#22c55e' }} />;
  if (curr < prev)  return <TrendingDown size={13} style={{ color: '#ef4444' }} />;
  return <Minus size={13} style={{ color: '#4a6080' }} />;
}

const WINDOW = 20; // points shown in chart

export default function Monitoring({ addToast }) {
  const [data, setData]     = useState(() => monitoringTimeSeries.slice(-WINDOW));
  const [live, setLive]     = useState(true);
  const [blink, setBlink]   = useState(true);
  const intervalRef = useRef(null);

  const latest = data[data.length - 1];
  const prev   = data[data.length - 2];

  useEffect(() => {
    // Blink the live dot
    const b = setInterval(() => setBlink(v => !v), 800);
    return () => clearInterval(b);
  }, []);

  useEffect(() => {
    if (!live) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setData(prev => {
        const next = nextPoint(prev[prev.length - 1]);
        const updated = [...prev.slice(-WINDOW + 1), next];
        return updated;
      });
    }, 2000);
    return () => clearInterval(intervalRef.current);
  }, [live]);

  const kpis = [
    { label: 'Throughput',  value: `${latest?.throughput ?? '—'} Gbps`, raw: latest?.throughput,  prevRaw: prev?.throughput,  color: '#00d4ff' },
    { label: 'Avg Latency', value: `${latest?.latency ?? '—'} ms`,      raw: latest?.latency,     prevRaw: prev?.latency,     color: '#22c55e' },
    { label: 'Packet Rate', value: `${latest?.packets ?? '—'} pps`,     raw: latest?.packets,     prevRaw: prev?.packets,     color: '#1e90ff' },
    { label: 'Bandwidth',   value: `${latest?.bandwidth ?? '—'} Gbps`,  raw: latest?.bandwidth,   prevRaw: prev?.bandwidth,   color: '#f59e0b' },
  ];

  return (
    <>
      {/* KPI Strip */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        {kpis.map(k => (
          <div key={k.label} className="stat-card" style={{ '--accent': k.color }}>
            <div className="stat-label">{k.label}</div>
            <div className="stat-value" style={{ fontSize: 22, color: k.color }}>{k.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
              <Trend curr={k.raw} prev={k.prevRaw} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>vs prev sample</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live toggle */}
      <div className="section-header" style={{ marginBottom: 16 }}>
        <div>
          <div className="section-title">Live Network Charts</div>
          <div className="section-subtitle">Auto-refreshes every 2 seconds</div>
        </div>
        <button
          className={`btn btn-sm ${live ? 'btn-danger' : 'btn-success'}`}
          onClick={() => setLive(v => !v)}
        >
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: live && blink ? '#fff' : 'transparent',
            display: 'inline-block', border: '1px solid #fff',
            transition: 'background 0.3s',
          }} />
          {live ? 'Pause Live Feed' : 'Resume Live Feed'}
        </button>
      </div>

      <div className="chart-grid">
        {/* Throughput */}
        <div className="chart-card">
          <div className="chart-title">Network Throughput (Gbps)</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="tpFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3050" />
              <XAxis dataKey="time" tick={{ fill: '#4a6080', fontSize: 9 }} />
              <YAxis tick={{ fill: '#4a6080', fontSize: 9 }} domain={['auto','auto']} />
              <Tooltip {...CHART_STYLE} />
              <Area type="monotone" dataKey="throughput" stroke="#00d4ff" fill="url(#tpFill)" strokeWidth={2} name="Gbps" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Latency */}
        <div className="chart-card">
          <div className="chart-title">End-to-End Latency (ms)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3050" />
              <XAxis dataKey="time" tick={{ fill: '#4a6080', fontSize: 9 }} />
              <YAxis tick={{ fill: '#4a6080', fontSize: 9 }} domain={['auto','auto']} />
              <Tooltip {...CHART_STYLE} />
              <Line type="monotone" dataKey="latency" stroke="#22c55e" strokeWidth={2} dot={false} name="ms" isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Packets per second */}
        <div className="chart-card">
          <div className="chart-title">Packets Per Second</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.slice(-12)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3050" />
              <XAxis dataKey="time" tick={{ fill: '#4a6080', fontSize: 9 }} />
              <YAxis tick={{ fill: '#4a6080', fontSize: 9 }} />
              <Tooltip {...CHART_STYLE} />
              <Bar dataKey="packets" fill="#1e90ff" fillOpacity={0.7} name="pps" radius={[3, 3, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bandwidth */}
        <div className="chart-card">
          <div className="chart-title">Bandwidth Utilisation (Gbps)</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="bwFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3050" />
              <XAxis dataKey="time" tick={{ fill: '#4a6080', fontSize: 9 }} />
              <YAxis tick={{ fill: '#4a6080', fontSize: 9 }} domain={['auto','auto']} />
              <Tooltip {...CHART_STYLE} />
              <Area type="monotone" dataKey="bandwidth" stroke="#a855f7" fill="url(#bwFill)" strokeWidth={2} name="Gbps" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Link Status Table */}
      <div style={{ marginTop: 24 }}>
        <div className="section-title" style={{ marginBottom: 12 }}>Live Link Status</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Link ID</th><th>Source</th><th>Target</th>
                <th>Bandwidth</th><th>Latency</th><th>Type</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {links.map(l => (
                <tr key={l.id}>
                  <td className="mono" style={{ color: 'var(--text-muted)' }}>{l.id}</td>
                  <td style={{ color: 'var(--text-primary)' }}>{l.source}</td>
                  <td style={{ color: 'var(--text-primary)' }}>{l.target}</td>
                  <td className="mono">{l.bandwidth}</td>
                  <td className="mono">{l.latency}ms</td>
                  <td>
                    <span style={{
                      fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
                      color: l.type === 'LAN' ? '#22c55e' : l.type === 'MAN' ? '#a855f7' : '#f59e0b',
                    }}>{l.type}</span>
                  </td>
                  <td><StatusBadge status={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
