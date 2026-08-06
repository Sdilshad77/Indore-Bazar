export default function SectionHeader({ title, subtitle, link, onLink }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-ink tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
      </div>
      {link && (
        <button
          onClick={onLink}
          className="text-sm font-bold text-primary hover:text-primary-dark shrink-0 px-2 py-1 -m-1"
        >
          {link} →
        </button>
      )}
    </div>
  );
}