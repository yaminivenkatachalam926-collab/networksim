import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header  from './components/Header';
import Toast   from './components/Toast';
import { useToast } from './components/Toast';
import { useState } from 'react';

import Dashboard       from './pages/Dashboard';
import Topology        from './pages/Topology';
import Devices         from './pages/Devices';
import PacketSimulator from './pages/PacketSimulator';
import Routing         from './pages/Routing';
import Monitoring      from './pages/Monitoring';
import Scenarios       from './pages/Scenarios';
import Settings        from './pages/Settings';

const PAGE_META = {
  '/dashboard':        { title: 'Dashboard',          subtitle: 'Campus NetSim / Overview'            },
  '/topology':         { title: 'Network Topology',   subtitle: 'Campus NetSim / Topology Map'        },
  '/devices':          { title: 'Device Registry',    subtitle: 'Campus NetSim / Devices'             },
  '/packet-simulator': { title: 'Packet Simulator',   subtitle: 'Campus NetSim / Packet Tracing'      },
  '/routing':          { title: 'Routing Protocols',  subtitle: 'Campus NetSim / OSPF & RIP'          },
  '/monitoring':       { title: 'Network Monitoring', subtitle: 'Campus NetSim / Live Metrics'        },
  '/scenarios':        { title: 'Scenarios & Chaos',  subtitle: 'Campus NetSim / Fault Injection'     },
  '/settings':         { title: 'Settings',           subtitle: 'Campus NetSim / Configuration'       },
};

function AppLayout({ path, children, addToast }) {
  const meta = PAGE_META[path] || { title: 'Campus NetSim', subtitle: '' };
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header title={meta.title} subtitle={meta.subtitle} />
        <main className="page-body">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <AppLayout path="/dashboard" addToast={addToast}>
            <Dashboard addToast={addToast} />
          </AppLayout>
        } />
        <Route path="/topology" element={
          <AppLayout path="/topology" addToast={addToast}>
            <Topology addToast={addToast} />
          </AppLayout>
        } />
        <Route path="/devices" element={
          <AppLayout path="/devices" addToast={addToast}>
            <Devices addToast={addToast} />
          </AppLayout>
        } />
        <Route path="/packet-simulator" element={
          <AppLayout path="/packet-simulator" addToast={addToast}>
            <PacketSimulator addToast={addToast} />
          </AppLayout>
        } />
        <Route path="/routing" element={
          <AppLayout path="/routing" addToast={addToast}>
            <Routing addToast={addToast} />
          </AppLayout>
        } />
        <Route path="/monitoring" element={
          <AppLayout path="/monitoring" addToast={addToast}>
            <Monitoring addToast={addToast} />
          </AppLayout>
        } />
        <Route path="/scenarios" element={
          <AppLayout path="/scenarios" addToast={addToast}>
            <Scenarios addToast={addToast} />
          </AppLayout>
        } />
        <Route path="/settings" element={
          <AppLayout path="/settings" addToast={addToast}>
            <Settings addToast={addToast} />
          </AppLayout>
        } />
      </Routes>
      <Toast toasts={toasts} removeToast={removeToast} />
    </BrowserRouter>
  );
}
