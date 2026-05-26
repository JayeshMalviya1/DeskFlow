import { useCallback, useEffect, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import StatsStrip from './components/StatsStrip.jsx';
import Filters from './components/Filters.jsx';
import Board from './components/Board.jsx';
import NewTicketForm from './components/NewTicketForm.jsx';
import { isValidTransition } from './utils/transitions.js';
import {
  createTicket,
  deleteTicket,
  getStats,
  getTickets,
  updateTicketStatus,
} from './api/tickets.js';

const INITIAL_FILTERS = { priority: '', breached: false };

function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [pendingMove, setPendingMove] = useState(null);
  const [cardErrors, setCardErrors] = useState({});
  const errorTimers = useRef({});

  const setTimedCardError = (id, message) => {
    if (errorTimers.current[id]) {
      clearTimeout(errorTimers.current[id]);
    }

    setCardErrors((prev) => ({ ...prev, [id]: message }));

    errorTimers.current[id] = setTimeout(() => {
      setCardErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      delete errorTimers.current[id];
    }, 2500);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [ticketData, statsData] = await Promise.all([
        getTickets({
          priority: filters.priority || undefined,
          breached: filters.breached || undefined,
        }),
        getStats(),
      ]);
      setTickets(ticketData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshStatsAndTickets = async () => {
    const [ticketData, statsData] = await Promise.all([
      getTickets({
        priority: filters.priority || undefined,
        breached: filters.breached || undefined,
      }),
      getStats(),
    ]);
    setTickets(ticketData);
    setStats(statsData);
  };

  const handleCreate = async (payload) => {
    setSubmitting(true);
    try {
      await createTicket(payload);
      await loadData();
    } catch (err) {
      setSubmitting(false);
      throw err;
    }
    setSubmitting(false);
  };

  const handleMove = async (id, newStatus) => {
    const ticket = tickets.find((t) => String(t._id) === String(id));
    if (!ticket || ticket.status === newStatus) return;

    if (!isValidTransition(ticket.status, newStatus)) {
      setTimedCardError(id, 'Invalid status transition');
      return;
    }

    const snapshot = tickets;
    setTickets((prev) =>
      prev.map((t) => (String(t._id) === String(id) ? { ...t, status: newStatus } : t))
    );
    setPendingMove({ id: String(id), target: newStatus });

    try {
      await updateTicketStatus(id, newStatus);
      await refreshStatsAndTickets();
    } catch (err) {
      setTickets(snapshot);
      setTimedCardError(id, err.message);
    } finally {
      setPendingMove(null);
    }
  };

  const handleDragMove = async (id, newStatus) => {
    const ticket = tickets.find((t) => t._id === id);
    if (!ticket || ticket.status === newStatus) return;

    if (!isValidTransition(ticket.status, newStatus)) {
      setTimedCardError(id, 'Cannot move here — invalid transition');
      return;
    }

    await handleMove(id, newStatus);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTicket(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <Header total={tickets.length} />

      <div className="app-body">
        <main className="main">
          <div className="main-section">
            <StatsStrip stats={stats} />
          </div>

          <Filters filters={filters} onChange={setFilters} />

          <Board
            tickets={tickets}
            loading={loading}
            error={error}
            onRetry={loadData}
            onMove={handleMove}
            onDragMove={handleDragMove}
            onDelete={handleDelete}
            pendingMove={pendingMove}
            cardErrors={cardErrors}
          />
        </main>

        <div className="sidebar">
          <NewTicketForm onSubmit={handleCreate} submitting={submitting} />
        </div>
      </div>
    </div>
  );
}

export default App;
