import './Filters.css';

const OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

function Filters({ filters, onChange }) {
  return (
    <section className="filters" aria-label="Filters">
      <select
        className="filters-select"
        value={filters.priority}
        onChange={(e) => onChange({ ...filters, priority: e.target.value })}
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value || 'all'} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <label
        className={`filters-breached ${filters.breached ? 'filters-breached--active' : ''}`}
      >
        <input
          type="checkbox"
          checked={filters.breached}
          onChange={(e) => onChange({ ...filters, breached: e.target.checked })}
          className="filters-checkbox"
        />
        <span className="filters-breached-text">Breached only</span>
      </label>
    </section>
  );
}

export default Filters;
