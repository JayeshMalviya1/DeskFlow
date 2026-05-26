import { formatAge } from '../utils/formatAge.js';
import './TicketCard.css';

const PRIORITY_CLASS = {
  urgent: 'badge--urgent',
  high: 'badge--high',
  medium: 'badge--medium',
  low: 'badge--low',
};

/** Compact card shown while dragging (DragOverlay). */
function TicketCardPreview({ ticket }) {
  return (
    <article className="ticket-card ticket-card--overlay">
      <div className="ticket-card-top">
        <h3 className="ticket-subject">{ticket.subject}</h3>
        <span className={`ticket-badge ${PRIORITY_CLASS[ticket.priority]}`}>
          {ticket.priority}
        </span>
      </div>
      <p className="ticket-email">{ticket.customerEmail}</p>
      <p className="ticket-meta-preview">{formatAge(ticket.ageMinutes)}</p>
    </article>
  );
}

export default TicketCardPreview;
