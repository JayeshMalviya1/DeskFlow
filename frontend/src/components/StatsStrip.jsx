import './StatsStrip.css';

const ITEMS = [
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'closed', label: 'Closed' },
  { key: 'breachedUnresolved', label: 'Breached', breached: true },
];

function StatsStrip({ stats }) {
  return (
    <section className="stats-strip" aria-label="Statistics">
      {ITEMS.map(({ key, label, breached }) => {
        const value = breached
          ? stats?.breachedUnresolved ?? 0
          : stats?.status?.[key] ?? 0;

        return (
          <div key={key} className="stat-card">
            <span className="stat-label">{label}</span>
            <span
              className={`stat-count ${breached && value > 0 ? 'stat-count--breached' : ''}`}
            >
              {value}
            </span>
          </div>
        );
      })}
    </section>
  );
}

export default StatsStrip;
