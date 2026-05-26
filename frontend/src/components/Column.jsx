import { useDroppable } from '@dnd-kit/core';
import TicketCard from './TicketCard.jsx';
import SkeletonCard from './SkeletonCard.jsx';
import './Column.css';

function Column({
  status,
  title,
  accent,
  tickets,
  loading,
  onMove,
  onDelete,
  pendingMove,
  cardErrors,
  dropTarget,
  isDragActive,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  });

  const isTarget = dropTarget?.status === status;
  let dropClass = '';

  if (isDragActive && isOver && isTarget) {
    if (dropTarget.sameColumn) {
      dropClass = 'column-body--drop-same';
    } else if (dropTarget.valid) {
      dropClass = 'column-body--drop-valid';
    } else {
      dropClass = 'column-body--drop-invalid';
    }
  }

  return (
    <div className="column">
      <div className="column-header">
        <h2 className="column-title">{title}</h2>
        <span className="column-count">{loading ? '—' : tickets.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`column-body ${dropClass}`}
        style={{ borderTopColor: accent }}
      >
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : tickets.length === 0 ? (
          <p className={`column-empty ${isDragActive ? 'column-empty--active' : ''}`}>
            {isDragActive ? 'Drop here' : 'No tickets'}
          </p>
        ) : (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              onMove={onMove}
              onDelete={onDelete}
              pendingMove={pendingMove}
              cardError={cardErrors?.[ticket._id]}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Column;
