# 🌐 Campus NetSim – Interactive Network Simulator

A modern, full-featured campus network simulator covering **LAN**, **MAN**, and **WAN** architectures with live telemetry, packet tracing, routing protocol visualization, and fault injection testbeds.

![Campus NetSim](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

- 📊 **Interactive Dashboard**: Real-time throughput metrics, live network activity stream, and health telemetry.
- 🗺️ **Visual Topology Map**: Full campus topology diagram spanning CSE LAN, ECE LAN, MAN Core Backbone, Data Center, and WAN edge.
- 💻 **Device Registry**: Filterable, searchable inventory of workstations, switches, routers, and servers with deep configuration inspection.
- ⚡ **Packet Simulator**: Step-by-step multi-hop transmission simulation with protocol selection (TCP, UDP, ICMP, HTTP, DNS), latency calculations, and packet drop analysis.
- 🔄 **Routing Protocols**: Comparative protocol metrics for OSPF, RIP, and BGP with an animated Dijkstra Shortest Path First (SPF) engine.
- 📈 **Network Monitoring**: Live multi-chart dashboard tracking throughput, latency, packets per second (PPS), and bandwidth utilization.
- ⚠️ **Chaos Engineering & Fault Injection**: Real-world failure scenarios including fiber cut failover, DDoS attacks, core router congestion, and recovery modes.
- ⚙️ **Simulation Settings**: Customisable simulation speeds, default routing protocols, firewall toggles, and UI themes.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation

```bash
# Clone repository
git clone https://github.com/yaminivenkatachalam926-collab/networksim.git

# Navigate into directory
cd networksim

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be accessible at `http://localhost:5173` (or the next available port).

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Routing**: React Router DOM v7
- **Styling**: Modern Vanilla CSS with dark theme, responsive grid, glassmorphism, and CSS variables
- **Charts & Telemetry**: Recharts
- **Icons**: Lucide React

---

## 📄 License

MIT License. Feel free to use and extend for academic, research, or demonstration purposes.
