import { useState } from 'react';
import { X } from 'lucide-react';

const areaOptions    = ['LAN', 'MAN', 'WAN'];
const typeOptions    = ['PC (Workstation)', 'Router', 'Switch', 'Server', 'Access Point', 'Firewall', 'Other'];
const statusOptions  = ['Active', 'Standby', 'Inactive'];

export default function DeviceModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    id: '', hostname: '', type: 'PC (Workstation)', ip: '',
    subnet: '255.255.255.0', gateway: '', area: 'LAN',
    status: 'Active', location: '',
  });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.id || !form.hostname || !form.ip) return;
    onAdd({ ...form });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="modal-title">Register Campus Network Device</div>
            <div className="modal-subtitle">Add a new device to the simulation topology (Demo Mode)</div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose} style={{ padding: '5px' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Device ID *</label>
              <input className="form-input" placeholder="e.g. PC-099" value={form.id} onChange={set('id')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Hardware Type *</label>
              <select className="form-input filter-select" value={form.type} onChange={set('type')}>
                {typeOptions.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Device Hostname / Label *</label>
            <input className="form-input" placeholder="e.g. CSE-PC-99" value={form.hostname} onChange={set('hostname')} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">IPv4 Address *</label>
              <input className="form-input" placeholder="192.168.10.x" value={form.ip} onChange={set('ip')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Subnet Mask</label>
              <input className="form-input" value={form.subnet} onChange={set('subnet')} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Default Gateway</label>
              <input className="form-input" placeholder="192.168.10.254" value={form.gateway} onChange={set('gateway')} />
            </div>
            <div className="form-group">
              <label className="form-label">Network Area *</label>
              <select className="form-input filter-select" value={form.area} onChange={set('area')}>
                {areaOptions.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Operational Status</label>
              <select className="form-input filter-select" value={form.status} onChange={set('status')}>
                {statusOptions.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Campus Location</label>
              <input className="form-input" placeholder="e.g. CSE Block A" value={form.location} onChange={set('location')} />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Register Device</button>
          </div>
        </form>
      </div>
    </div>
  );
}
