import Ticket, { PRIORITIES, STATUSES } from '../models/ticket.model.js';
import { AppError } from '../utils/AppError.js';
import { enrichTicket, isSlaBreached } from '../utils/enrichTicket.js';
import { isValidTransition } from '../utils/transitions.js';

const UNRESOLVED_STATUSES = ['open', 'in_progress'];

/**
 * Builds a count map with every enum value initialized to zero.
 */
const buildCountMap = (keys, aggregationRows) => {
  const counts = Object.fromEntries(keys.map((key) => [key, 0]));

  aggregationRows.forEach(({ _id, count }) => {
    if (_id in counts) {
      counts[_id] = count;
    }
  });

  return counts;
};

export const createTicket = async (payload) => {
  const ticket = await Ticket.create(payload);
  return enrichTicket(ticket);
};

export const getTickets = async ({ status, priority, breached }) => {
  const query = {};

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  const tickets = await Ticket.find(query).sort({ createdAt: -1 });
  let results = tickets.map((ticket) => enrichTicket(ticket));

  if (breached === true) {
    results = results.filter((ticket) => ticket.slaBreached);
  }

  return results;
};

export const updateTicketStatus = async (id, newStatus) => {
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }

  if (!isValidTransition(ticket.status, newStatus)) {
    throw new AppError('Invalid status transition', 400);
  }

  const previousStatus = ticket.status;

  ticket.status = newStatus;

  if (newStatus === 'resolved' && previousStatus !== 'resolved') {
    ticket.resolvedAt = new Date();
  } else if (previousStatus === 'resolved' && newStatus !== 'resolved') {
    ticket.resolvedAt = null;
  }

  await ticket.save();

  return enrichTicket(ticket);
};

export const deleteTicket = async (id) => {
  const ticket = await Ticket.findByIdAndDelete(id);

  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }

  return enrichTicket(ticket);
};

export const getTicketStats = async () => {
  const [statusAggregation, priorityAggregation, unresolvedTickets] = await Promise.all([
    Ticket.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Ticket.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
    Ticket.find({ status: { $in: UNRESOLVED_STATUSES } }),
  ]);

  const status = buildCountMap(STATUSES, statusAggregation);
  const priority = buildCountMap(PRIORITIES, priorityAggregation);

  const breachedUnresolved = unresolvedTickets.filter((ticket) =>
    isSlaBreached(ticket)
  ).length;

  return {
    status,
    priority,
    breachedUnresolved,
  };
};
