import { useState } from 'react';
import { Save, RotateCcw, Wifi, Shield, Bell, Palette, Server, Globe } from 'lucide-react';

const SECTIONS = [
  { id: 'network', icon: Wifi, label: 'Network' },
  { id: 'security', icon: Shield, label: 'Security' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'appearance', icon: Palette, label: 'Appearance' },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      className={`settings-toggle ${checked ? 'on' : ''}`}
      onClick={() => onChange(!checked)}
      type="button"
    >
      <span className="settings-toggle-knob" />
    </button>
  );
}

export default function Settings({ addToast }) {
  const [section, setSection] = useState('network');
  const [config, setConfig] = useState({
    simulationSpeed: 1,
    defaultProtocol: 'OSPF',
    enableDHCP: true,
    enableDNS: true,
    defaultSubnet: '255.255.255.0',
    maxHops: 30,
    packetTTL: 64,
    firewallEnabled: true,
    encryptionType: 'AES-256',
    portSecurity: true,
    aclEnabled: true,
    maxLoginAttempts: 5,
    linkDown: true,
    packetDrop: true,
    latencySpike: false,
    emailAlerts: false,
    soundEnabled: true,
    theme: 'dark',
    animationSpeed: 'normal',
    showGridLines: true,
    compactMode: false,
    monoFont: true,
  });

  const update = (key, val) => setConfig(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    addToast?.('Settings saved successfully', 'success');
  };
  const handleReset = () => {
    addToast?.('Settings reset to defaults', 'info');
  };

  return (
    <>
      <div className="settings-layout">
        {/* Section tabs */}
        <div className="settings-tabs">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              className={`settings-tab ${section === s.id ? 'active' : ''}`}
              onClick={() => setSection(s.id)}
            >
              <s.icon size={15} />
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="settings-content">
          {section === 'network' && (
            <div className="settings-section">
              <div className="settings-group-title"><Server size={15} /> Simulation Engine</div>
              <div className="settings-row">
                <div><div className="settings-label">Simulation Speed</div><div className="settings-hint">Multiplier for packet travel time</div></div>
                <select className="settings-select" value={config.simulationSpeed} onChange={e => update('simulationSpeed', Number(e.target.value))}>
                  <option value={0.5}>0.5× (Slow)</option>
                  <option value={1}>1× (Normal)</option>
                  <option value={2}>2× (Fast)</option>
                  <option value={4}>4× (Ultra)</option>
                </select>
              </div>
              <div className="settings-row">
                <div><div className="settings-label">Default Routing Protocol</div><div className="settings-hint">Used when adding new routers</div></div>
                <select className="settings-select" value={config.defaultProtocol} onChange={e => update('defaultProtocol', e.target.value)}>
                  <option>OSPF</option>
                  <option>RIP</option>
                  <option>BGP</option>
                  <option>Static</option>
                </select>
              </div>
              <div className="settings-row">
                <div><div className="settings-label">Packet TTL</div><div className="settings-hint">Default Time-to-Live value</div></div>
                <input className="settings-input" type="number" value={config.packetTTL} min={1} max={255} onChange={e => update('packetTTL', Number(e.target.value))} />
              </div>
              <div className="settings-row">
                <div><div className="settings-label">Max Hops</div><div className="settings-hint">Maximum hops for traceroute</div></div>
                <input className="settings-input" type="number" value={config.maxHops} min={1} max={64} onChange={e => update('maxHops', Number(e.target.value))} />
              </div>

              <div className="settings-group-title" style={{ marginTop: 24 }}><Globe size={15} /> Network Services</div>
              <div className="settings-row">
                <div><div className="settings-label">DHCP Server</div><div className="settings-hint">Auto-assign IP addresses</div></div>
                <Toggle checked={config.enableDHCP} onChange={v => update('enableDHCP', v)} />
              </div>
              <div className="settings-row">
                <div><div className="settings-label">DNS Server</div><div className="settings-hint">Name resolution service</div></div>
                <Toggle checked={config.enableDNS} onChange={v => update('enableDNS', v)} />
              </div>
              <div className="settings-row">
                <div><div className="settings-label">Default Subnet Mask</div><div className="settings-hint">Applied to new interfaces</div></div>
                <select className="settings-select" value={config.defaultSubnet} onChange={e => update('defaultSubnet', e.target.value)}>
                  <option>255.255.255.0</option>
                  <option>255.255.0.0</option>
                  <option>255.0.0.0</option>
                </select>
              </div>
            </div>
          )}

          {section === 'security' && (
            <div className="settings-section">
              <div className="settings-group-title"><Shield size={15} /> Firewall &amp; Access Control</div>
              <div className="settings-row">
                <div><div className="settings-label">Firewall</div><div className="settings-hint">Enable stateful packet inspection</div></div>
                <Toggle checked={config.firewallEnabled} onChange={v => update('firewallEnabled', v)} />
              </div>
              <div className="settings-row">
                <div><div className="settings-label">Encryption</div><div className="settings-hint">Data-at-rest and in-transit</div></div>
                <select className="settings-select" value={config.encryptionType} onChange={e => update('encryptionType', e.target.value)}>
                  <option>AES-256</option>
                  <option>AES-128</option>
                  <option>None</option>
                </select>
              </div>
              <div className="settings-row">
                <div><div className="settings-label">Port Security</div><div className="settings-hint">MAC address filtering on switch ports</div></div>
                <Toggle checked={config.portSecurity} onChange={v => update('portSecurity', v)} />
              </div>
              <div className="settings-row">
                <div><div className="settings-label">ACL Rules</div><div className="settings-hint">Access Control Lists on interfaces</div></div>
                <Toggle checked={config.aclEnabled} onChange={v => update('aclEnabled', v)} />
              </div>
              <div className="settings-row">
                <div><div className="settings-label">Max Login Attempts</div><div className="settings-hint">Before lockout triggers</div></div>
                <input className="settings-input" type="number" value={config.maxLoginAttempts} min={1} max={20} onChange={e => update('maxLoginAttempts', Number(e.target.value))} />
              </div>
            </div>
          )}

          {section === 'notifications' && (
            <div className="settings-section">
              <div className="settings-group-title"><Bell size={15} /> Alert Triggers</div>
              <div className="settings-row">
                <div><div className="settings-label">Link Down</div><div className="settings-hint">Alert when a network link goes offline</div></div>
                <Toggle checked={config.linkDown} onChange={v => update('linkDown', v)} />
              </div>
              <div className="settings-row">
                <div><div className="settings-label">Packet Drop</div><div className="settings-hint">Alert on packets dropped at routers</div></div>
                <Toggle checked={config.packetDrop} onChange={v => update('packetDrop', v)} />
              </div>
              <div className="settings-row">
                <div><div className="settings-label">Latency Spike</div><div className="settings-hint">Alert when latency exceeds threshold</div></div>
                <Toggle checked={config.latencySpike} onChange={v => update('latencySpike', v)} />
              </div>
              <div className="settings-row">
                <div><div className="settings-label">Email Alerts</div><div className="settings-hint">Send alerts via email (simulated)</div></div>
                <Toggle checked={config.emailAlerts} onChange={v => update('emailAlerts', v)} />
              </div>
              <div className="settings-row">
                <div><div className="settings-label">Sound Effects</div><div className="settings-hint">Play sounds on events</div></div>
                <Toggle checked={config.soundEnabled} onChange={v => update('soundEnabled', v)} />
              </div>
            </div>
          )}

          {section === 'appearance' && (
            <div className="settings-section">
              <div className="settings-group-title"><Palette size={15} /> Visual Preferences</div>
              <div className="settings-row">
                <div><div className="settings-label">Theme</div><div className="settings-hint">Application color scheme</div></div>
                <select className="settings-select" value={config.theme} onChange={e => update('theme', e.target.value)}>
                  <option value="dark">Dark (Default)</option>
                  <option value="midnight">Midnight</option>
                  <option value="deep-ocean">Deep Ocean</option>
                </select>
              </div>
              <div className="settings-row">
                <div><div className="settings-label">Animation Speed</div><div className="settings-hint">UI transition speed</div></div>
                <select className="settings-select" value={config.animationSpeed} onChange={e => update('animationSpeed', e.target.value)}>
                  <option value="slow">Slow</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div className="settings-row">
                <div><div className="settings-label">Grid Lines</div><div className="settings-hint">Show grid overlay on topology</div></div>
                <Toggle checked={config.showGridLines} onChange={v => update('showGridLines', v)} />
              </div>
              <div className="settings-row">
                <div><div className="settings-label">Compact Mode</div><div className="settings-hint">Reduce spacing and padding</div></div>
                <Toggle checked={config.compactMode} onChange={v => update('compactMode', v)} />
              </div>
              <div className="settings-row">
                <div><div className="settings-label">Monospace Font</div><div className="settings-hint">Use JetBrains Mono for data</div></div>
                <Toggle checked={config.monoFont} onChange={v => update('monoFont', v)} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="settings-actions">
        <button className="btn btn-outline" onClick={handleReset}>
          <RotateCcw size={14} /> Reset Defaults
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={14} /> Save Settings
        </button>
      </div>
    </>
  );
}
