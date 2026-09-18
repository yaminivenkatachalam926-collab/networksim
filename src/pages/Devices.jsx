import { useState } from 'react';
import { Monitor, Plus, Search, Filter, Trash2, Edit3 } from 'lucide-react';
import { devices as initialDevices } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import DeviceModal from '../components/DeviceModal';

export default function Devices({ addToast }) {
  const [devices, setDevices]     = useState(initialDevices);
  const [search,  setSearch]      = useState('');
  const [areaFilter, setArea]     = useState('All');
  const [typeFilter, setType]     = useState('All');
  const [showModal, setModal]     = useState(false);

  const areas = ['All', 'LAN', 'MAN', 'WAN'];
  const types = ['All', ...new Set(initialDevices.map(d => d.type))];

  const filtered = devices.filter(d => {
    const matchSearch = d.hostname.toLowerCase().includes(search.toLowerCase()) ||
                        d.ip.includes(search) || d.id.toLowerCase().includes(search.toLowerCase());
    const matchArea = areaFilter === 'All' || d.area === areaFilter;
    const matchType = typeFilter === 'All' || d.type === typeFilter;
    return matchSearch && matchArea && matchType;
  });

  const handleAdd = (dev) => {
    setDevices(prev => [...prev, dev]);
    addToast(`Device ${dev.hostname} registered successfully.`, 'success');
  };

  const handleDelete = (id) => {
    const dev = devices.find(d => d.id === id);
    setDevices(prev => prev.filter(d => d.id !== id));
    addToast(`Device ${dev.hostname} removed from registry.`, 'warning');
  };

  const active  = devices.filter(d => d.status === 'Active').length;
  const standby = devices.filter(d => d.status === 'Standby').length;

  return (
    <>
      {/* Summary Row */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        {[
          { label: 'Total Devices', value: devices.length, color: '#1e90ff' },
          { label: 'Active',        value: active,          color: '#22c55e' },
          { label: 'Standby',       value: standby,         color: '#94a3b8' },
          { label: 'Filtered',      value: filtered.length, color: '#00d4ff' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ '--accent': s.color }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: 26 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="section-header">
        <div>
          <div className="section-title">Device Registry</div>
          <div className="section-subtitle">{filtered.length} device(s) shown</div>
        </div>
        <div className="section-actions">
          <div className="search-wrap">
            <Search size={14} />
            <input
              className="search-input"
              placeholder="Search hostname, IP, ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="filter-select" value={areaFilter} onChange={e => setArea(e.target.value)}>
            {areas.map(a => <option key={a}>{a}</option>)}
          </select>
          <select className="filter-select" value={typeFilter} onChange={e => setType(e.target.value)}>
            {types.map(t => <option key={t}>{t}</option>)}
          </select>
          <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}>
            <Plus size={14} /> Register Device
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Hostname</th>
              <th>Type</th>
              <th>IP Address</th>
              <th>Subnet</th>
              <th>Gateway</th>
              <th>Area</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                  No devices match the current filters.
                </td>
              </tr>
            )}
            {filtered.map(d => (
              <tr key={d.id}>
                <td className="mono" style={{ color: 'var(--text-muted)' }}>{d.id}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{d.hostname}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{d.type}</td>
                <td className="mono">{d.ip}</td>
                <td className="mono" style={{ color: 'var(--text-muted)' }}>{d.subnet}</td>
                <td className="mono" style={{ color: 'var(--text-muted)' }}>{d.gateway}</td>
                <td>
                  <span style={{
                    fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
                    color: d.area === 'LAN' ? '#22c55e' : d.area === 'MAN' ? '#a855f7' : '#f59e0b'
                  }}>{d.area}</span>
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{d.location}</td>
                <td><StatusBadge status={d.status} /></td>
                <td>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleDelete(d.id)}
                    title="Remove device"
                    style={{ padding: '4px 8px', color: 'var(--red)', borderColor: '#ef444430' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <DeviceModal onClose={() => setModal(false)} onAdd={handleAdd} />}
    </>
  );
}
