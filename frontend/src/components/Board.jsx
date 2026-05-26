import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import Column from './Column.jsx';
import TicketCardPreview from './TicketCardPreview.jsx';
import { isValidTransition } from '../utils/transitions.js';
import { API_BASE_URL } from '../config/apiBase.js';
import './Board.css';

const COLUMNS = [
  { status: 'open', title: 'Open', accent: 'var(--col-open)' },
  { status: 'in_progress', title: 'In Progress', accent: 'var(--col-progress)' },
  { status: 'resolved', title: 'Resolved', accent: 'var(--col-resolved)' },
  { status: 'closed', title: 'Closed', accent: 'var(--col-closed)' },
];

function Board({
  tickets,
  loading,
  error,
  onRetry,
  onMove,
  onDelete,
  onDragMove,
  pendingMove,
  cardErrors,
}) {
  const [activeTicket, setActiveTicket] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    })
  );

  if (error) {
    return (
      <div className="board-error" role="alert">
        <p>
          Failed to load tickets. {error}
        </p>
        <p className="board-error-api">API: {API_BASE_URL}</p>
        <button type="button" className="board-retry" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  const byStatus = COLUMNS.reduce((acc, col) => {
    acc[col.status] = tickets.filter((t) => t.status === col.status);
    return acc;
  }, {});

  const handleDragStart = (event) => {
    const ticket = tickets.find((t) => t._id === event.active.id);
    setActiveTicket(ticket ?? null);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) {
      setDropTarget(null);
      return;
    }

    const targetStatus = over.data.current?.status;
    const ticket = tickets.find((t) => t._id === active.id);

    if (!targetStatus || !ticket) {
      setDropTarget(null);
      return;
    }

    const sameColumn = ticket.status === targetStatus;

    setDropTarget({
      status: targetStatus,
      valid: isValidTransition(ticket.status, targetStatus),
      sameColumn,
    });
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTicket(null);
    setDropTarget(null);

    if (!over) return;

    const targetStatus = over.data.current?.status;
    const ticketId = active.id;

    if (!targetStatus) return;

    await onDragMove(ticketId, targetStatus);
  };

  const handleDragCancel = () => {
    setActiveTicket(null);
    setDropTarget(null);
  };

  return (
    <>
      <p className="board-hint">
        <strong>Drag any ticket</strong> and drop it on a column to change status
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <section className="board" aria-label="Ticket board">
          {COLUMNS.map((col) => (
            <Column
              key={col.status}
              status={col.status}
              title={col.title}
              accent={col.accent}
              tickets={byStatus[col.status]}
              loading={loading}
              onMove={onMove}
              onDelete={onDelete}
              pendingMove={pendingMove}
              cardErrors={cardErrors}
              dropTarget={dropTarget}
              isDragActive={Boolean(activeTicket)}
            />
          ))}
        </section>

        <DragOverlay dropAnimation={{ duration: 220, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1)' }}>
          {activeTicket ? <TicketCardPreview ticket={activeTicket} /> : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}

export default Board;
