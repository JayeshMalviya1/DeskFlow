import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { formatAge } from '../utils/formatAge.js';
import { getTransitionActions } from '../utils/transitions.js';
import './TicketCard.css';

const PRIORITY_CLASS = {
  urgent: 'badge--urgent',
  high: 'badge--high',
  medium: 'badge--medium',
  low: 'badge--low',
};

/** Stops drag from starting when interacting with buttons/links inside the card. */
const stopDrag = (e) => e.stopPropagation();

function TicketCard({ ticket, onMove, onDelete, pendingMove, cardError }) {
  const actions = getTransitionActions(ticket.status);
  const isMoving =
    pendingMove?.id != null && String(pendingMove.id) === String(ticket._id);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ticket._id,
    data: { ticket, status: ticket.status },
  });

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Delete this ticket?')) {
      onDelete(ticket._id);
    }
  };

  const handleMoveClick = (e, target) => {
    e.stopPropagation();
    onMove(ticket._id, target);
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`ticket-card ${ticket.slaBreached ? 'ticket-card--breached' : ''} ${
        isDragging ? 'ticket-card--dragging' : ''
      } ${cardError ? 'ticket-card--shake' : ''}`}
      {...listeners}
      {...attributes}
    >
      <div className="ticket-card-body">
        <div className="ticket-card-top">
          <h3 className="ticket-subject">{ticket.subject}</h3>
          <span className={`ticket-badge ${PRIORITY_CLASS[ticket.priority]}`}>
            {ticket.priority}
          </span>
        </div>

        <p className="ticket-email">{ticket.customerEmail}</p>

        <div className="ticket-meta">
          <span className="ticket-age">
            <span className="ticket-age-icon" aria-hidden>
              🕐
            </span>
            {formatAge(ticket.ageMinutes)}
          </span>
          {ticket.slaBreached && <span className="ticket-sla">⚠ SLA Breached</span>}
        </div>
      </div>

      {cardError && (
        <p className="ticket-card-error" role="alert">
          {cardError}
        </p>
      )}

      <div
        className="ticket-actions"
        onPointerDown={stopDrag}
        onClick={(e) => e.stopPropagation()}
      >
        {actions.map(({ target, label, isForward }) => {
          const isPending = isMoving && pendingMove.target === target;

          return (
            <button
              key={target}
              type="button"
              disabled={isMoving || isDragging}
              className={`ticket-move ${isForward ? 'ticket-move--forward' : 'ticket-move--back'}`}
              onPointerDown={stopDrag}
              onClick={(e) => handleMoveClick(e, target)}
            >
              {isPending ? <span className="ticket-spinner" aria-label="Moving" /> : label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="ticket-delete"
        disabled={isMoving || isDragging}
        onPointerDown={stopDrag}
        onClick={handleDelete}
      >
        Delete ticket
      </button>
    </article>
  );
}

export default TicketCard;
