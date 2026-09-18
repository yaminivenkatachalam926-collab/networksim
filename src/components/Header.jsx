import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

const LIVE_EVENTS = [
  { type: 'success', title: 'Packet delivered',        detail: 'CSE-PC-01 → Campus-Web-Portal' },
  { type: 'info',    title: 'OSPF route updated',      detail: 'North-Core → Data Center' },
  { type: 'success', title: 'Link health check',       detail: '18/18 links online' },
  { type: 'warning', title: 'Latency spike detected',  detail: 'WAN link: 84 ms' },
  { type: 'info',    title: 'RIP advertisement',       detail: 'South-Core broadcast' },
  { type: 'success', title: 'Packet delivered',        detail: 'ECE-WS-01 → Campus-DNS' },
  { type: 'info',    title: 'SPF recalculation',       detail: 'OSPF area 0 converged' },
  { type: 'warning', title: 'High utilisation',        detail: 'Campus-Agg-Switch: 91%' },
  { type: 'success', title: 'BGP session UP',          detail: 'AS 65001 ↔ AS 65002' },
  { type: 'info',    title: 'DHCP lease renewed',      detail: 'CSE-PC-03 → 192.168.10.23' },
];

const DOT_COLOR = { success: '#22c55e', warning: '#f59e0b', info: '#00d4ff', error: '#ef4444' };

export default function Header({ title, subtitle }) {
  const [time, setTime]       = useState(new Date());
  const [alerts, setAlerts]   = useState([]);
  const [showAlerts, setShow] = useState(false);
  const [unread, setUnread]   = useState(0);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate incoming network events every ~8 seconds
  useEffect(() => {
    const push = () => {
      const ev = LIVE_EVENTS[Math.floor(Math.random() * LIVE_EVENTS.length)];
      const now = new Date();
      const ts  = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
      setAlerts(prev => [{ ...ev, id: Date.now(), time: ts }, ...prev].slice(0, 20));
      setUnread(n => n + 1);
    };
    // Initial seed after 3s
    const init = setTimeout(push, 3000);
    const iv   = setInterval(push, 8000);
    return () => { clearTimeout(init); clearInterval(iv); };
  }, []);

  const fmt = (n) => String(n).padStart(2, '0');
  const timeStr = `${fmt(time.getHours())}:${fmt(time.getMinutes())}:${fmt(time.getSeconds())}`;

  const openAlerts = () => { setShow(v => !v); setUnread(0); };

  return (
    <header className="top-header" style={{ position: 'relative' }}>
      <div className="header-left">
        <h1>{title}</h1>
        {subtitle && <div className="breadcrumb">{subtitle}</div>}
      </div>

      <div className="header-right">
        <div className="demo-mode-badge">
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          Demo Mode
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={openAlerts}
            style={{
              background: showAlerts ? 'rgba(0,212,255,0.1)' : 'var(--bg-card)',
              border: `1px solid ${showAlerts ? 'var(--cyan)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--r-md)',
              padding: '6px 10px',
              color: showAlerts ? 'var(--cyan)' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: 6,
              cursor: 'pointer', transition: 'all 0.2s',
              position: 'relative',
            }}
          >
            <Bell size={15} />
            {unread > 0 && (
              <span style={{
                position: 'absolute', top: -5, right: -5,
                background: '#ef4444', color: '#fff', fontSize: 10,
                fontWeight: 700, borderRadius: '50%',
                width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--bg-secondary)',
              }}>
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {/* Dropdown panel */}
          {showAlerts && (
            <div style={{
              position: 'absolute', top: 44, right: 0,
              width: 320, background: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: 'var(--r-lg)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              zIndex: 200, overflow: 'hidden',
              animation: 'slideUp 0.2s ease',
            }}>
              <div style={{
                padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Network Events</span>
                <button
                  onClick={() => setAlerts([])}
                  style={{ background: 'none', border: 'none', fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  Clear all
                </button>
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {alerts.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                    No recent events
                  </div>
                ) : alerts.map(ev => (
                  <div key={ev.id} style={{
                    display: 'flex', gap: 10, padding: '10px 16px',
                    borderBottom: '1px solid var(--border-subtle)',
                    alignItems: 'flex-start',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: DOT_COLOR[ev.type] || '#94a3b8',
                      marginTop: 5, flexShrink: 0,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, color: 'var(--text-primary)', fontWeight: 500 }}>{ev.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ev.detail}</div>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--text-mono)', whiteSpace: 'nowrap' }}>{ev.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="header-time">{timeStr}</div>
      </div>
    </header>
  );
}
