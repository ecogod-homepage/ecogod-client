export default function AdminStatusBadge({ tone = "default", children }) {
  return <span className={`admin-status-badge ${tone}`}>{children}</span>;
}
