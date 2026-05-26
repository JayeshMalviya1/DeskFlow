import { useEffect, useState } from 'react';
import './NewTicketForm.css';

const EMPTY = {
  subject: '',
  description: '',
  customerEmail: '',
  priority: 'medium',
};

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

function NewTicketForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success) return undefined;
    const timer = setTimeout(() => setSuccess(false), 2000);
    return () => clearTimeout(timer);
  }, [success]);

  const validate = () => {
    const next = {};

    if (!form.subject.trim()) next.subject = 'Subject is required';
    if (!form.description.trim()) next.description = 'Description is required';
    if (!form.customerEmail.trim()) {
      next.customerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) {
      next.customerEmail = 'Enter a valid email';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setApiError('');

    try {
      await onSubmit({
        subject: form.subject.trim(),
        description: form.description.trim(),
        customerEmail: form.customerEmail.trim(),
        priority: form.priority,
      });
      setForm(EMPTY);
      setSuccess(true);
    } catch (err) {
      setApiError(err.message);
    }
  };

  return (
    <aside className="new-ticket">
      <h2 className="new-ticket-title">New Ticket</h2>

      <form className="new-ticket-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="subject">Subject *</label>
          <input
            id="subject"
            value={form.subject}
            onChange={handleChange('subject')}
            disabled={submitting}
          />
          {errors.subject && <span className="field-error">{errors.subject}</span>}
        </div>

        <div className="field">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={handleChange('description')}
            disabled={submitting}
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>

        <div className="field">
          <label htmlFor="email">Customer Email *</label>
          <input
            id="email"
            type="email"
            value={form.customerEmail}
            onChange={handleChange('customerEmail')}
            disabled={submitting}
          />
          {errors.customerEmail && (
            <span className="field-error">{errors.customerEmail}</span>
          )}
        </div>

        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={form.priority}
            onChange={handleChange('priority')}
            disabled={submitting}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {apiError && <div className="form-alert form-alert--error">{apiError}</div>}
        {success && <div className="form-alert form-alert--success">Ticket created!</div>}

        <button type="submit" className="form-submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Ticket'}
        </button>
      </form>
    </aside>
  );
}

export default NewTicketForm;
