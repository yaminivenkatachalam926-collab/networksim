import { useState } from 'react';
import { AlertTriangle, Shield, Zap, RefreshCw } from 'lucide-react';
import { scenarios, links as initialLinks } from '../data/mockData';

const ICON_MAP = {
  AlertTriangle, Shield, Zap, RefreshCw,
};

export default function Scenarios({ addToast }) {
  const [activeScenario, setActive] = useState(null);
  const [linkStates, setLinkStates] = useState(
    Object.fromEntries(initialLinks.map(l => [l.id, 'Online']))
  );

  const runScenario = (scenario) => {
    if (activeScenario === scenario.id && scenario.faultType !== 'restore') return;

    switch (scenario.faultType) {
      case 'fiber_cut':
        setLinkStates(prev => ({ ...prev, L13: 'Offline' }));
        setActive(scenario.id);
        addToast('FAULT: North↔South Core fiber link cut. Rerouting…', 'error');
        break;

      case 'ddos':
        setActive(scenario.id);
        addToast('ATTACK: DDoS flood detected on Campus Web Portal!', 'error');
        setTimeout(() => addToast('Packet rate: 450,000 pps (10× normal)', 'warning'), 1200);
        break;

      case 'congestion':
        setActive(scenario.id);
        addToast('PERF: North Campus Core congested — latency 380ms', 'warning');
        break;

      case 'wan_degradation':
        setLinkStates(prev => ({ ...prev, L18: 'Degraded' }));
        setActive(scenario.id);
        addToast('WAN: ISP uplink degraded — packet loss 32%', 'warning');
        break;

      case 'restore':
        setLinkStates(Object.fromEntries(initialLinks.map(l => [l.id, 'Online'])));
        setActive(null);
        addToast('Recovery: All links and metrics restored to normal.', 'success');
        break;

      default:
        break;
    }
  };

  const affectedLinks = {
    S01: ['L13'],
    S04: ['L18'],
  };

  return (
    <>
      {/* Active Fault Banner */}
      {activeScenario && activeScenario !== 'S05' && (
        <div className="scenario-alert" style={{ marginBottom: 20 }}>
          <AlertTriangle size={16} />
          <span>
            <strong>Active Fault Scenario:</strong>{' '}
            {scenarios.find(s => s.id === activeScenario)?.title}
            {' '}— Network state is simulated. Click "Restore" to clear.
          </span>
        </div>
      )}

      <div className="section-header" style={{ marginBottom: 16 }}>
        <div>
          <div className="section-title">Fault Injection & Chaos Engineering</div>
          <div className="section-subtitle">Simulate real-world network faults and observe behavior</div>
        </div>
      </div>

      <div className="scenario-grid">
        {scenarios.map(sc => {
          const Icon = ICON_MAP[sc.icon] || AlertTriangle;
          const isActive = activeScenario === sc.id;

          return (
            <div
              key={sc.id}
              className="scenario-card"
              style={{
                borderColor: isActive
                  ? sc.categoryColor
                  : sc.faultType === 'restore' ? '#22c55e30' : undefined,
                background: isActive ? `${sc.categoryColor}08` : undefined,
              }}
            >
              {/* Category */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: `${sc.categoryColor}18`,
                  border: `1px solid ${sc.categoryColor}30`,
                }}>
                  <Icon size={18} color={sc.categoryColor} />
                </div>
                <div>
                  <div className="scenario-cat" style={{ color: sc.categoryColor }}>
                    {sc.category}
                  </div>
                  <div className="scenario-title">{sc.title}</div>
                </div>
              </div>

              {sc.subtitle && <div className="scenario-subtitle">{sc.subtitle}</div>}

              <div className="scenario-desc">{sc.description}</div>

              <div className="scenario-expected">
                <strong style={{ color: 'var(--cyan)' }}>Expected:</strong> {sc.expected}
              </div>

              {/* Affected links */}
              {affectedLinks[sc.id] && (
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Affected links:{' '}
                  {affectedLinks[sc.id].map(lid => (
                    <span key={lid} style={{
                      padding: '1px 7px', borderRadius: 20, fontSize: 11,
                      background: linkStates[lid] === 'Online' ? '#22c55e15' : '#ef444415',
                      border: `1px solid ${linkStates[lid] === 'Online' ? '#22c55e30' : '#ef444430'}`,
                      color: linkStates[lid] === 'Online' ? '#22c55e' : '#ef4444',
                      marginRight: 4,
                    }}>
                      {lid}: {linkStates[lid]}
                    </span>
                  ))}
                </div>
              )}

              <button
                className={`btn btn-sm ${
                  sc.faultType === 'restore' ? 'btn-success' :
                  isActive ? 'btn-outline' : 'btn-danger'
                }`}
                onClick={() => runScenario(sc)}
                style={isActive && sc.faultType !== 'restore' ? {
                  opacity: 0.6, cursor: 'not-allowed',
                  borderColor: sc.categoryColor, color: sc.categoryColor
                } : {}}
              >
                <Icon size={13} />
                {sc.faultType === 'restore' ? 'Restore Normal State' :
                 isActive ? 'Active (Running)' : 'Inject Fault'}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
