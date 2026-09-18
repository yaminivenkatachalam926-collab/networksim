export default function StatusBadge({ status }) {
  const map = {
    Active:    'badge-active',
    Online:    'badge-active',
    Delivered: 'badge-active',
    Warning:   'badge-warning',
    Degraded:  'badge-warning',
    Error:     'badge-error',
    Down:      'badge-error',
    Offline:   'badge-error',
    Standby:   'badge-standby',
    Info:      'badge-info',
    ACTIVE:    'badge-active',
  };
  return <span className={`badge ${map[status] || 'badge-info'}`}>{status}</span>;
}
