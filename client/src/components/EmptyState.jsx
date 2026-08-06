export default function EmptyState({ icon = "🛒", title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-ink">{title}</h3>
      {subtitle && <p className="text-muted mt-2 max-w-sm text-sm">{subtitle}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}