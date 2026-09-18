export default function StatCard({ icon: Icon, iconBg, iconColor, accent, label, value, sub }) {
  return (
    <div className="stat-card" style={{ '--accent': accent || '#00d4ff' }}>
      <div className="stat-icon" style={{ background: iconBg || '#00d4ff15' }}>
        {Icon && <Icon size={17} color={iconColor || '#00d4ff'} />}
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}
