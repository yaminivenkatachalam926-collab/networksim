import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Network, Monitor, Zap, Share2,
  Activity, AlertTriangle, Settings, Radio
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',         icon: LayoutDashboard, label: 'Dashboard'           },
  { to: '/topology',          icon: Network,         label: 'Network Topology'    },
  { to: '/devices',           icon: Monitor,         label: 'Devices'             },
  { to: '/packet-simulator',  icon: Zap,             label: 'Packet Simulator'    },
  { to: '/routing',           icon: Share2,          label: 'Routing Protocols'   },
  { to: '/monitoring',        icon: Activity,        label: 'Monitoring'          },
  { to: '/scenarios',         icon: AlertTriangle,   label: 'Scenarios & Chaos'   },
  { to: '/settings',          icon: Settings,        label: 'Settings'            },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Radio size={20} />
        </div>
        <div className="sidebar-title">Campus NetSim</div>
        <div className="sidebar-subtitle">LAN • MAN • WAN</div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-label">Navigation</div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="demo-badge">
          <span className="pulse-dot" />
          Demo Mode Active
        </div>
      </div>
    </aside>
  );
}
