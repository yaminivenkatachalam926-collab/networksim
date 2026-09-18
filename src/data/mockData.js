// ============================================================
// Campus NetSim – Mock Data (Frontend Only)
// All data is static/simulated. No backend. No API.
// ============================================================

export const devices = [
  { id: 'PC-001',  hostname: 'CSE-PC-01',                 type: 'PC (Workstation)',  ip: '192.168.10.21',  subnet: '255.255.255.0', gateway: '192.168.10.254', area: 'LAN', location: 'CSE Block A', status: 'Active'  },
  { id: 'PC-002',  hostname: 'CSE-PC-02',                 type: 'PC (Workstation)',  ip: '192.168.10.22',  subnet: '255.255.255.0', gateway: '192.168.10.254', area: 'LAN', location: 'CSE Block A', status: 'Active'  },
  { id: 'PC-003',  hostname: 'CSE-PC-03',                 type: 'PC (Workstation)',  ip: '192.168.10.23',  subnet: '255.255.255.0', gateway: '192.168.10.254', area: 'LAN', location: 'CSE Block B', status: 'Active'  },
  { id: 'SW-001',  hostname: 'CSE-Switch-Access',         type: 'Switch',            ip: '192.168.10.10',  subnet: '255.255.255.0', gateway: '192.168.10.254', area: 'LAN', location: 'CSE Server Room', status: 'Active'  },
  { id: 'RT-001',  hostname: 'CSE-Gateway-Router',        type: 'Router',            ip: '192.168.10.254', subnet: '255.255.255.0', gateway: '10.0.0.1',       area: 'LAN', location: 'CSE Server Room', status: 'Active'  },
  { id: 'WS-001',  hostname: 'ECE-Workstation-01',        type: 'PC (Workstation)',  ip: '192.168.20.21',  subnet: '255.255.255.0', gateway: '192.168.20.254', area: 'LAN', location: 'ECE Block A', status: 'Active'  },
  { id: 'WS-002',  hostname: 'ECE-Workstation-02',        type: 'PC (Workstation)',  ip: '192.168.20.22',  subnet: '255.255.255.0', gateway: '192.168.20.254', area: 'LAN', location: 'ECE Block A', status: 'Active'  },
  { id: 'SW-002',  hostname: 'ECE-Switch-Access',         type: 'Switch',            ip: '192.168.20.10',  subnet: '255.255.255.0', gateway: '192.168.20.254', area: 'LAN', location: 'ECE Server Room', status: 'Active'  },
  { id: 'RT-002',  hostname: 'ECE-Gateway-Router',        type: 'Router',            ip: '192.168.20.254', subnet: '255.255.255.0', gateway: '10.0.0.2',       area: 'LAN', location: 'ECE Server Room', status: 'Active'  },
  { id: 'AP-001',  hostname: 'CSE-WiFi-AP',               type: 'Access Point',      ip: '192.168.10.5',   subnet: '255.255.255.0', gateway: '192.168.10.254', area: 'LAN', location: 'CSE Hall', status: 'Active'  },
  { id: 'RT-003',  hostname: 'North-Campus-Core',         type: 'Router',            ip: '10.0.0.1',       subnet: '255.255.0.0',   gateway: '10.0.0.100',     area: 'MAN', location: 'North Campus Hub', status: 'Active'  },
  { id: 'RT-004',  hostname: 'South-Campus-Core',         type: 'Router',            ip: '10.0.0.2',       subnet: '255.255.0.0',   gateway: '10.0.0.100',     area: 'MAN', location: 'South Campus Hub', status: 'Active'  },
  { id: 'SW-003',  hostname: 'Campus-Aggregation-Switch', type: 'Switch',            ip: '10.0.0.100',     subnet: '255.255.0.0',   gateway: '10.0.0.1',       area: 'MAN', location: 'Central Network Room', status: 'Active'  },
  { id: 'RT-005',  hostname: 'Campus-Edge-Router',        type: 'Router',            ip: '203.0.113.1',    subnet: '255.255.255.0', gateway: '203.0.113.254',  area: 'WAN', location: 'WAN Gateway', status: 'Active'  },
  { id: 'SRV-001', hostname: 'External-Cloud-Host',       type: 'Server',            ip: '203.0.113.50',   subnet: '255.255.255.0', gateway: '203.0.113.1',    area: 'WAN', location: 'Cloud DC', status: 'Standby' },
  { id: 'SRV-002', hostname: 'Campus-Web-Portal',         type: 'Server',            ip: '172.16.0.10',    subnet: '255.255.255.0', gateway: '172.16.0.1',     area: 'MAN', location: 'Data Center', status: 'Active'  },
  { id: 'SRV-003', hostname: 'Campus-DNS',                type: 'Server',            ip: '172.16.0.5',     subnet: '255.255.255.0', gateway: '172.16.0.1',     area: 'MAN', location: 'Data Center', status: 'Active'  },
  { id: 'SW-004',  hostname: 'DataCenter-Switch',         type: 'Switch',            ip: '172.16.0.1',     subnet: '255.255.255.0', gateway: '10.0.0.100',     area: 'MAN', location: 'Data Center', status: 'Active'  },
];

export const links = [
  { id: 'L01', source: 'CSE-PC-01',              target: 'CSE-Switch-Access',         bandwidth: '1 Gbps',  latency: 2,  type: 'LAN',   status: 'Online'  },
  { id: 'L02', source: 'CSE-PC-02',              target: 'CSE-Switch-Access',         bandwidth: '1 Gbps',  latency: 2,  type: 'LAN',   status: 'Online'  },
  { id: 'L03', source: 'CSE-PC-03',              target: 'CSE-Switch-Access',         bandwidth: '1 Gbps',  latency: 2,  type: 'LAN',   status: 'Online'  },
  { id: 'L04', source: 'CSE-WiFi-AP',            target: 'CSE-Switch-Access',         bandwidth: '300 Mbps',latency: 5,  type: 'LAN',   status: 'Online'  },
  { id: 'L05', source: 'CSE-Switch-Access',      target: 'CSE-Gateway-Router',        bandwidth: '1 Gbps',  latency: 2,  type: 'LAN',   status: 'Online'  },
  { id: 'L06', source: 'ECE-Workstation-01',     target: 'ECE-Switch-Access',         bandwidth: '1 Gbps',  latency: 2,  type: 'LAN',   status: 'Online'  },
  { id: 'L07', source: 'ECE-Workstation-02',     target: 'ECE-Switch-Access',         bandwidth: '1 Gbps',  latency: 2,  type: 'LAN',   status: 'Online'  },
  { id: 'L08', source: 'ECE-Switch-Access',      target: 'ECE-Gateway-Router',        bandwidth: '1 Gbps',  latency: 2,  type: 'LAN',   status: 'Online'  },
  { id: 'L09', source: 'CSE-Gateway-Router',     target: 'North-Campus-Core',         bandwidth: '10 Gbps', latency: 5,  type: 'MAN',   status: 'Online'  },
  { id: 'L10', source: 'ECE-Gateway-Router',     target: 'South-Campus-Core',         bandwidth: '10 Gbps', latency: 5,  type: 'MAN',   status: 'Online'  },
  { id: 'L11', source: 'North-Campus-Core',      target: 'Campus-Aggregation-Switch', bandwidth: '10 Gbps', latency: 5,  type: 'MAN',   status: 'Online'  },
  { id: 'L12', source: 'South-Campus-Core',      target: 'Campus-Aggregation-Switch', bandwidth: '10 Gbps', latency: 5,  type: 'MAN',   status: 'Online'  },
  { id: 'L13', source: 'North-Campus-Core',      target: 'South-Campus-Core',         bandwidth: '10 Gbps', latency: 3,  type: 'MAN',   status: 'Online'  },
  { id: 'L14', source: 'Campus-Aggregation-Switch', target: 'DataCenter-Switch',      bandwidth: '10 Gbps', latency: 8,  type: 'MAN',   status: 'Online'  },
  { id: 'L15', source: 'DataCenter-Switch',      target: 'Campus-Web-Portal',         bandwidth: '1 Gbps',  latency: 1,  type: 'MAN',   status: 'Online'  },
  { id: 'L16', source: 'DataCenter-Switch',      target: 'Campus-DNS',                bandwidth: '1 Gbps',  latency: 1,  type: 'MAN',   status: 'Online'  },
  { id: 'L17', source: 'Campus-Aggregation-Switch', target: 'Campus-Edge-Router',     bandwidth: '1 Gbps',  latency: 12, type: 'WAN',   status: 'Online'  },
  { id: 'L18', source: 'Campus-Edge-Router',     target: 'External-Cloud-Host',       bandwidth: '1.5 Mbps',latency: 40, type: 'WAN',   status: 'Online'  },
];

export const routingTable = [
  { destination: '192.168.10.0/24', nextHop: '10.0.0.1',   iface: 'MAN-01',  metric: 10, protocol: 'OSPF', status: 'Active'  },
  { destination: '192.168.20.0/24', nextHop: '10.0.0.2',   iface: 'MAN-02',  metric: 20, protocol: 'OSPF', status: 'Active'  },
  { destination: '172.16.0.0/24',   nextHop: '10.0.0.100', iface: 'CORE-01', metric: 15, protocol: 'RIP',  status: 'Active'  },
  { destination: '203.0.113.0/24',  nextHop: '10.0.0.200', iface: 'WAN-01',  metric: 50, protocol: 'OSPF', status: 'Active'  },
  { destination: '10.0.0.0/16',     nextHop: '10.0.0.1',   iface: 'CORE-02', metric: 5,  protocol: 'OSPF', status: 'Active'  },
  { destination: '0.0.0.0/0',       nextHop: '203.0.113.1',iface: 'WAN-GW',  metric: 100,protocol: 'OSPF', status: 'Active'  },
];

export const packetHistory = [
  { id: 1, source: 'CSE-PC-01',         destination: 'Campus-Web-Portal', type: 'TCP',  size: 1024, hops: 6, latency: 42, status: 'Delivered', time: '10:42:18' },
  { id: 2, source: 'ECE-Workstation-01',destination: 'Campus-DNS',        type: 'UDP',  size: 512,  hops: 5, latency: 38, status: 'Delivered', time: '10:41:52' },
  { id: 3, source: 'CSE-PC-02',         destination: 'External-Cloud-Host',type:'TCP',  size: 2048, hops: 8, latency: 92, status: 'Delivered', time: '10:40:31' },
];

export const activityStream = [
  { time: '10:42:18', type: 'success', title: 'Packet delivered',        detail: 'CSE-PC-01 → CSE-Gateway' },
  { time: '10:41:52', type: 'info',    title: 'OSPF route updated',      detail: 'North-Core → Data Center' },
  { time: '10:40:31', type: 'success', title: 'Link health check',       detail: '16/16 links online' },
  { time: '10:39:14', type: 'warning', title: 'Latency spike detected',  detail: 'WAN link: 82 ms' },
  { time: '10:38:02', type: 'info',    title: 'RIP route advertisement', detail: 'South-Core broadcast' },
  { time: '10:36:45', type: 'success', title: 'Packet delivered',        detail: 'ECE-WS-01 → Campus-DNS' },
  { time: '10:35:11', type: 'info',    title: 'SPF recalculation',       detail: 'OSPF area 0 converged' },
];

export const monitoringTimeSeries = (() => {
  const data = [];
  for (let i = 0; i < 20; i++) {
    data.push({
      time: `${String(10).padStart(2,'0')}:${String(i * 3).padStart(2,'0')}`,
      throughput: +(3.5 + Math.random() * 2.5).toFixed(2),
      packets:    Math.floor(80 + Math.random() * 40),
      latency:    Math.floor(30 + Math.random() * 30),
      bandwidth:  +(3.0 + Math.random() * 3.0).toFixed(2),
    });
  }
  return data;
})();

export const scenarios = [
  {
    id: 'S01',
    category: 'FAULT-TOLERANCE',
    categoryColor: '#ef4444',
    title: 'MAN Backbone Fiber Cut',
    subtitle: '(Failover Test)',
    description: 'Simulate a physical fiber cable cut between North Core Router and South Core Router.',
    expected: 'Traffic should reroute through the alternate path with higher latency.',
    icon: 'AlertTriangle',
    faultType: 'fiber_cut',
  },
  {
    id: 'S02',
    category: 'SECURITY',
    categoryColor: '#f59e0b',
    title: 'DDoS Attack on Campus Web Portal',
    subtitle: '',
    description: 'Simulate a distributed denial-of-service traffic flood against the Campus Web Portal.',
    expected: 'High packet volume and increased latency.',
    icon: 'Shield',
    faultType: 'ddos',
  },
  {
    id: 'S03',
    category: 'PERFORMANCE',
    categoryColor: '#f59e0b',
    title: 'North Campus Core Router Congestion',
    subtitle: '',
    description: 'Simulate severe peak-hour congestion on the North Campus Core gateway.',
    expected: 'Reduced bandwidth and increased response latency.',
    icon: 'Zap',
    faultType: 'congestion',
  },
  {
    id: 'S04',
    category: 'PERFORMANCE',
    categoryColor: '#f59e0b',
    title: 'WAN Uplink Degradation & Packet Storm',
    subtitle: '',
    description: 'Simulate ISP uplink degradation on the external WAN connection.',
    expected: 'Internet traffic experiences high packet loss and latency.',
    icon: 'Zap',
    faultType: 'wan_degradation',
  },
  {
    id: 'S05',
    category: 'RECOVERY',
    categoryColor: '#22c55e',
    title: 'Restore Normal Network State',
    subtitle: '(Clear All Faults)',
    description: 'Restore all simulated network links and metrics to normal operational state.',
    expected: 'All services return to normal operational state.',
    icon: 'RefreshCw',
    faultType: 'restore',
  },
];

export const topologyNodes = [
  // CSE LAN
  { id: 'cse-pc-01',   label: 'CSE-PC-01',              type: 'pc',       ip: '192.168.10.21',  area: 'CSE LAN',    x: 80,  y: 130 },
  { id: 'cse-pc-02',   label: 'CSE-PC-02',              type: 'pc',       ip: '192.168.10.22',  area: 'CSE LAN',    x: 80,  y: 210 },
  { id: 'cse-pc-03',   label: 'CSE-PC-03',              type: 'pc',       ip: '192.168.10.23',  area: 'CSE LAN',    x: 80,  y: 290 },
  { id: 'cse-ap',      label: 'CSE-WiFi-AP',            type: 'ap',       ip: '192.168.10.5',   area: 'CSE LAN',    x: 80,  y: 370 },
  { id: 'cse-sw',      label: 'CSE-Switch',             type: 'switch',   ip: '192.168.10.10',  area: 'CSE LAN',    x: 220, y: 250 },
  { id: 'cse-gw',      label: 'CSE-Gateway',            type: 'router',   ip: '192.168.10.254', area: 'CSE LAN',    x: 360, y: 250 },
  // ECE LAN
  { id: 'ece-ws-01',   label: 'ECE-WS-01',              type: 'pc',       ip: '192.168.20.21',  area: 'ECE LAN',    x: 80,  y: 530 },
  { id: 'ece-ws-02',   label: 'ECE-WS-02',              type: 'pc',       ip: '192.168.20.22',  area: 'ECE LAN',    x: 80,  y: 610 },
  { id: 'ece-sw',      label: 'ECE-Switch',             type: 'switch',   ip: '192.168.20.10',  area: 'ECE LAN',    x: 220, y: 570 },
  { id: 'ece-gw',      label: 'ECE-Gateway',            type: 'router',   ip: '192.168.20.254', area: 'ECE LAN',    x: 360, y: 570 },
  // MAN Core
  { id: 'north-core',  label: 'North-Core',             type: 'router',   ip: '10.0.0.1',       area: 'MAN Core',   x: 540, y: 250 },
  { id: 'south-core',  label: 'South-Core',             type: 'router',   ip: '10.0.0.2',       area: 'MAN Core',   x: 540, y: 570 },
  { id: 'agg-sw',      label: 'Campus-Agg-Switch',      type: 'switch',   ip: '10.0.0.100',     area: 'MAN Core',   x: 700, y: 410 },
  // Data Center
  { id: 'dc-sw',       label: 'DC-Switch',              type: 'switch',   ip: '172.16.0.1',     area: 'Data Center',x: 880, y: 340 },
  { id: 'web-portal',  label: 'Campus-Web-Portal',      type: 'server',   ip: '172.16.0.10',    area: 'Data Center',x: 1020,y: 290 },
  { id: 'campus-dns',  label: 'Campus-DNS',             type: 'server',   ip: '172.16.0.5',     area: 'Data Center',x: 1020,y: 390 },
  // WAN
  { id: 'edge-router', label: 'Campus-Edge-Router',     type: 'router',   ip: '203.0.113.1',    area: 'WAN',        x: 880, y: 500 },
  { id: 'cloud-host',  label: 'External-Cloud-Host',    type: 'cloud',    ip: '203.0.113.50',   area: 'WAN',        x: 1020,y: 520 },
];

export const topologyEdges = [
  { id: 'e01', source: 'cse-pc-01',  target: 'cse-sw',      bw: '1 Gbps',   type: 'lan' },
  { id: 'e02', source: 'cse-pc-02',  target: 'cse-sw',      bw: '1 Gbps',   type: 'lan' },
  { id: 'e03', source: 'cse-pc-03',  target: 'cse-sw',      bw: '1 Gbps',   type: 'lan' },
  { id: 'e04', source: 'cse-ap',     target: 'cse-sw',      bw: '300 Mbps', type: 'lan' },
  { id: 'e05', source: 'cse-sw',     target: 'cse-gw',      bw: '1 Gbps',   type: 'lan' },
  { id: 'e06', source: 'ece-ws-01',  target: 'ece-sw',      bw: '1 Gbps',   type: 'lan' },
  { id: 'e07', source: 'ece-ws-02',  target: 'ece-sw',      bw: '1 Gbps',   type: 'lan' },
  { id: 'e08', source: 'ece-sw',     target: 'ece-gw',      bw: '1 Gbps',   type: 'lan' },
  { id: 'e09', source: 'cse-gw',     target: 'north-core',  bw: '10 Gbps',  type: 'man' },
  { id: 'e10', source: 'ece-gw',     target: 'south-core',  bw: '10 Gbps',  type: 'man' },
  { id: 'e11', source: 'north-core', target: 'agg-sw',      bw: '10 Gbps',  type: 'man' },
  { id: 'e12', source: 'south-core', target: 'agg-sw',      bw: '10 Gbps',  type: 'man' },
  { id: 'e13', source: 'north-core', target: 'south-core',  bw: '10 Gbps',  type: 'man' },
  { id: 'e14', source: 'agg-sw',     target: 'dc-sw',       bw: '10 Gbps',  type: 'man' },
  { id: 'e15', source: 'dc-sw',      target: 'web-portal',  bw: '1 Gbps',   type: 'man' },
  { id: 'e16', source: 'dc-sw',      target: 'campus-dns',  bw: '1 Gbps',   type: 'man' },
  { id: 'e17', source: 'agg-sw',     target: 'edge-router', bw: '1 Gbps',   type: 'wan' },
  { id: 'e18', source: 'edge-router',target: 'cloud-host',  bw: '1.5 Mbps', type: 'wan' },
];
