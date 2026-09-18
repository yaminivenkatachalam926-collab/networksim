import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Zap } from 'lucide-react';
import { devices, packetHistory as initialHistory } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';

// Precompute a hop path between two hostnames (simplified simulation)
function buildPath(srcHostname, dstHostname, allDevices) {
  const src = allDevices.find(d => d.hostname === srcHostname);
  const dst = allDevices.find(d => d.hostname === dstHostname);
  if (!src || !dst || src.id === dst.id) return [];

  // Build a representative hop path based on areas
  const path = [srcHostname];

  if (src.area === 'LAN' && dst.area === 'LAN' && src.gateway === dst.gateway) {
    path.push(allDevices.find(d => d.ip === src.gateway)?.hostname || 'Gateway');
  } else if (src.area === 'LAN') {
    const gw = allDevices.find(d => d.ip === src.gateway);
    if (gw) path.push(gw.hostname);
    path.push('North-Campus-Core');
    if (dst.area === 'WAN') {
      path.push('Campus-Aggregation-Switch');
      path.push('Campus-Edge-Router');
    } else if (dst.area === 'MAN') {
      path.push('Campus-Aggregation-Switch');
    } else {
      // another LAN
      path.push('Campus-Aggregation-Switch');
      const dstGw = allDevices.find(d => d.ip === dst.gateway);
      if (dstGw) path.push(dstGw.hostname);
    }
  } else {
    path.push('Campus-Aggregation-Switch');
  }
  if (!path.includes(dstHostname)) path.push(dstHostname);
  return path;
}

const PACKET_TYPES = ['TCP', 'UDP', 'ICMP', 'HTTP', 'DNS'];

export default function PacketSimulator({ addToast }) {
  const srcHosts = devices.filter(d => ['PC (Workstation)'].includes(d.type));
  const dstHosts = devices.filter(d => ['Server', 'PC (Workstation)'].includes(d.type));

  const [src, setSrc]           = useState(srcHosts[0]?.hostname || '');
  const [dst, setDst]           = useState(dstHosts.find(d => d.type === 'Server')?.hostname || '');
  const [pktType, setPktType]   = useState('TCP');
  const [pktSize, setPktSize]   = useState(1024);
  const [running, setRunning]   = useState(false);
  const [activeIdx, setActive]  = useState(-1);
  const [result, setResult]     = useState(null);
  const [history, setHistory]   = useState(initialHistory);
  const timerRef                = useRef(null);

  const hopPath = src && dst ? buildPath(src, dst, devices) : [];

  const simulate = () => {
    if (!src || !dst || src === dst || running) return;
    setRunning(true);
    setActive(0);
    setResult(null);

    let idx = 0;
    timerRef.current = setInterval(() => {
      idx += 1;
      setActive(idx);
      if (idx >= hopPath.length - 1) {
        clearInterval(timerRef.current);
        const latency = Math.floor(hopPath.length * 8 + Math.random() * 20);
        const delivered = Math.random() > 0.05;
        const status = delivered ? 'Delivered' : 'Dropped';
        setResult({ hops: hopPath.length, latency, status });
        setRunning(false);
        setHistory(prev => [{
          id: prev.length + 1, source: src, destination: dst,
          type: pktType, size: pktSize, hops: hopPath.length,
          latency, status,
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        }, ...prev]);
        addToast(
          delivered ? `Packet delivered: ${src} → ${dst} in ${latency}ms` : `Packet dropped: ${src} → ${dst}`,
          delivered ? 'success' : 'error'
        );
      }
    }, 600);
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setRunning(false);
    setActive(-1);
    setResult(null);
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Config Panel */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 18 }}>Packet Configuration</div>

          <div className="form-group">
            <label className="form-label">Source Host</label>
            <select className="form-input filter-select" value={src} onChange={e => { setSrc(e.target.value); reset(); }}>
              {srcHosts.map(d => <option key={d.id} value={d.hostname}>{d.hostname} ({d.ip})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Destination Host</label>
            <select className="form-input filter-select" value={dst} onChange={e => { setDst(e.target.value); reset(); }}>
              {dstHosts.map(d => <option key={d.id} value={d.hostname}>{d.hostname} ({d.ip})</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Packet Type</label>
              <select className="form-input filter-select" value={pktType} onChange={e => setPktType(e.target.value)}>
                {PACKET_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Payload Size (bytes)</label>
              <input className="form-input" type="number" min={64} max={65535}
                value={pktSize} onChange={e => setPktSize(Number(e.target.value))} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" onClick={simulate} disabled={running || !src || !dst || src === dst}>
              <Play size={14} /> {running ? 'Simulating…' : 'Send Packet'}
            </button>
            <button className="btn btn-outline" onClick={reset} disabled={running}>
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          {result && (
            <div style={{
              marginTop: 20, padding: '14px 16px',
              background: result.status === 'Delivered' ? '#22c55e0d' : '#ef44440d',
              border: `1px solid ${result.status === 'Delivered' ? '#22c55e30' : '#ef444430'}`,
              borderRadius: 10,
            }}>
              <div style={{ fontWeight: 700, color: result.status === 'Delivered' ? '#22c55e' : '#ef4444', marginBottom: 8 }}>
                {result.status === 'Delivered' ? '✓ Packet Delivered' : '✗ Packet Dropped'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', gap: 20 }}>
                <span><strong style={{ color: 'var(--text-primary)' }}>{result.hops}</strong> hops</span>
                <span><strong style={{ color: 'var(--text-primary)' }}>{result.latency}ms</strong> latency</span>
                <span><strong style={{ color: 'var(--text-primary)' }}>{pktSize}B</strong> payload</span>
              </div>
            </div>
          )}
        </div>

        {/* Hop Path Visualisation */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 18 }}>
            Packet Hop Path ({hopPath.length} hops)
          </div>
          {hopPath.length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', marginTop: 40 }}>
              Select source and destination to preview path
            </div>
          )}
          <div className="packet-path">
            {hopPath.map((hop, i) => (
              <div key={i} style={{ width: '100%' }}>
                <div className={`path-node ${activeIdx === i ? 'active' : activeIdx > i ? 'passed' : ''}`}>
                  <Zap size={13} />
                  {hop}
                </div>
                {i < hopPath.length - 1 && (
                  <div className="path-arrow">
                    <div className="path-arrow-line" />
                    {activeIdx === i && <div className="packet-dot" />}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History */}
      <div className="section-header" style={{ marginBottom: 12 }}>
        <div className="section-title">Packet Transmission History</div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Source</th><th>Destination</th><th>Type</th>
              <th>Size</th><th>Hops</th><th>Latency</th><th>Status</th><th>Time</th>
            </tr>
          </thead>
          <tbody>
            {history.map(p => (
              <tr key={p.id}>
                <td className="mono" style={{ color: 'var(--text-muted)' }}>{p.id}</td>
                <td style={{ color: 'var(--text-primary)' }}>{p.source}</td>
                <td style={{ color: 'var(--text-primary)' }}>{p.destination}</td>
                <td><span style={{ fontFamily: 'var(--text-mono)', fontSize: 11, color: '#00d4ff' }}>{p.type}</span></td>
                <td className="mono">{p.size}B</td>
                <td className="mono">{p.hops}</td>
                <td className="mono">{p.latency}ms</td>
                <td><StatusBadge status={p.status} /></td>
                <td className="mono" style={{ color: 'var(--text-muted)' }}>{p.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
