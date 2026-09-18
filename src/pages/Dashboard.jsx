import { useState, useEffect } from 'react';
import { Network, Monitor, Share2, Wifi, Activity, Zap, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import {
  devices, links, activityStream as seedActivity, monitoringTimeSeries
} from '../data/mockData';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

// Live activity events pool
const EVENT_POOL = [
  { type: 'success', title: 'Packet delivered',        detail: 'CSE-PC-01 → Campus-Web-Portal' },
  { type: 'info',    title: 'OSPF route updated',      detail: 'North-Core → Data Center' },
  { type: 'success', title: 'Link health check',       detail: '18/18 links online' },
  { type: 'warning', title: 'Latency spike detected',  detail: 'WAN link: 84 ms' },
  { type: 'info',    title: 'RIP advertisement',       detail: 'South-Core broadcast' },
  { type: 'success', title: 'Packet delivered',        detail: 'ECE-WS-01 → Campus-DNS' },
  { type: 'info',    title: 'SPF recalculation',       detail: 'OSPF area 0 converged' },
  { type: 'warning', title: 'High utilisation',        detail: 'Agg-Switch: 91%' },
  { type: 'success', title: 'BGP session UP',          detail: 'AS 65001 ↔ AS 65002' },
];

function makeChartPoint() {
  const now = new Date();
  const hh  = String(now.getHours()).padStart(2,'0');
  const mm  = String(now.getMinutes()).padStart(2,'0');
  return {
    time:       `${hh}:${mm}`,
    throughput: +(3.0 + Math.random() * 3.5).toFixed(2),
  };
}

export default function Dashboard({ addToast }) {
  const navigate = useNavigate();

  const activeDevices = devices.filter(d => d.status === 'Active').length;
  const onlineLinks   = links.filter(l => l.status === 'Online').length;
  const lanDevices    = devices.filter(d => d.area === 'LAN').length;
  const manDevices    = devices.filter(d => d.area === 'MAN').length;
  const wanDevices    = devices.filter(d => d.area === 'WAN').length;

  const [chartData,   setChartData]   = useState(() => monitoringTimeSeries.slice(-10));
  const [activity,    setActivity]    = useState(() =>
    seedActivity.map((e, i) => ({ ...e, id: i }))
  );
  const [avgLatency,  setAvgLatency]  = useState(42);

  // Live chart update every 3s
  useEffect(() => {
    const iv = setInterval(() => {
      const pt = makeChartPoint();
      setChartData(prev => [...prev.slice(-9), pt]);
      setAvgLatency(Math.floor(30 + Math.random() * 30));
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  // Live activity stream — new event every 6s
  useEffect(() => {
    const iv = setInterval(() => {
      const ev = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
      const now = new Date();
      const ts  = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
      setActivity(prev => [{ ...ev, id: Date.now(), time: ts }, ...prev].slice(0, 8));
    }, 6000);
    return () => clearInterval(iv);
  }, []);

  return (
    <>
      {/* Stat Cards */}
      <div className="stat-grid">
        <StatCard icon={Monitor}  iconBg="#1e90ff15" iconColor="#1e90ff" accent="#1e90ff"
          label="Total Devices" value={devices.length} sub={`${activeDevices} active`} />
        <StatCard icon={Network}  iconBg="#00d4ff15" iconColor="#00d4ff" accent="#00d4ff"
          label="Network Links" value={links.length}  sub={`${onlineLinks} online`} />
        <StatCard icon={Wifi}     iconBg="#22c55e15" iconColor="#22c55e" accent="#22c55e"
          label="LAN Nodes"    value={lanDevices}     sub="192.168.x.x" />
        <StatCard icon={Share2}   iconBg="#a855f715" iconColor="#a855f7" accent="#a855f7"
          label="MAN Nodes"    value={manDevices}     sub="10.0.x.x / 172.16.x.x" />
        <StatCard icon={Zap}      iconBg="#f59e0b15" iconColor="#f59e0b" accent="#f59e0b"
          label="WAN Nodes"    value={wanDevices}     sub="203.0.113.x" />
        <StatCard icon={Activity} iconBg="#22c55e15" iconColor="#22c55e" accent="#22c55e"
          label="Avg Latency"  value={`${avgLatency}ms`} sub="Across all links" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Throughput Chart */}
        <div className="card">
          <div className="section-header" style={{ marginBottom: 16 }}>
            <div>
              <div className="section-title">Live Throughput</div>
              <div className="section-subtitle">Gbps across campus backbone</div>
            </div>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 11, color: '#22c55e',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              Live
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="tpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3050" />
              <XAxis dataKey="time" tick={{ fill: '#4a6080', fontSize: 10 }} />
              <YAxis tick={{ fill: '#4a6080', fontSize: 10 }} domain={['auto','auto']} />
              <Tooltip contentStyle={{ background: '#0d1f3c', border: '1px solid #1a3050', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="throughput" stroke="#00d4ff" fill="url(#tpGrad)" strokeWidth={2} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Stream */}
        <div className="card">
          <div className="section-header" style={{ marginBottom: 16 }}>
            <div>
              <div className="section-title">Activity Stream</div>
              <div className="section-subtitle">Real-time network events</div>
            </div>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 11, color: '#22c55e',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              Live
            </span>
          </div>
          <div>
            {activity.slice(0, 6).map((ev) => {
              const dotColor = ev.type === 'success' ? '#22c55e' : ev.type === 'warning' ? '#f59e0b' : '#00d4ff';
              return (
                <div key={ev.id} className="activity-item">
                  <div className="activity-dot" style={{ background: dotColor }} />
                  <div style={{ flex: 1 }}>
                    <div className="activity-title">{ev.title}</div>
                    <div className="activity-detail">{ev.detail}</div>
                  </div>
                  <div className="activity-time">{ev.time}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Network Health + Quick Nav */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Device Overview */}
        <div className="card">
          <div className="section-header" style={{ marginBottom: 12 }}>
            <div className="section-title">Device Overview</div>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/devices')}>
              View All <ArrowUpRight size={13} />
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Hostname</th>
                  <th>IP Address</th>
                  <th>Area</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {devices.slice(0, 7).map(d => (
                  <tr key={d.id}>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{d.hostname}</td>
                    <td className="mono">{d.ip}</td>
                    <td><span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{d.area}</span></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{d.type}</td>
                    <td><StatusBadge status={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Network Health */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 18 }}>Network Health</div>
          {[
            { label: 'LAN Uptime',    pct: 100, color: '#22c55e' },
            { label: 'MAN Backbone',  pct: 100, color: '#22c55e' },
            { label: 'WAN / ISP Link',pct: 87,  color: '#f59e0b' },
            { label: 'DNS Services',  pct: 100, color: '#22c55e' },
            { label: 'Web Portal',    pct: 95,  color: '#00d4ff' },
          ].map(h => (
            <div key={h.label} className="health-bar-wrap">
              <div className="health-bar-label">
                <span>{h.label}</span>
                <span style={{ color: h.color, fontWeight: 600 }}>{h.pct}%</span>
              </div>
              <div className="health-bar-track">
                <div className="health-bar-fill" style={{ width: `${h.pct}%`, background: h.color }} />
              </div>
            </div>
          ))}

          <div style={{ marginTop: 20 }}>
            <div className="section-title" style={{ marginBottom: 10, fontSize: 13 }}>Network Tiers</div>
            <div className="tier-grid">
              {[
                { name: 'LAN', count: lanDevices, sub: 'Endpoints & Access' },
                { name: 'MAN', count: manDevices, sub: 'Campus Core' },
                { name: 'WAN', count: wanDevices, sub: 'Edge & Cloud' },
              ].map(t => (
                <div key={t.name} className="tier-card">
                  <div className="tier-name">{t.name}</div>
                  <div className="tier-node-count">{t.count}</div>
                  <div className="tier-sub">{t.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
