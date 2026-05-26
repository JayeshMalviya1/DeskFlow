import { getAgeMinutes } from './age.js';
import { getSlaLimitMinutes } from './sla.js';

/**
 * Determines whether the ticket breached its priority SLA.
 *
 * - Unresolved: current age exceeds the limit.
 * - Resolved/closed: age at resolution exceeded the limit.
 */
export const isSlaBreached = (ticket) => {
  const limit = getSlaLimitMinutes(ticket.priority);
  const ageMinutes = getAgeMinutes(ticket);
  return ageMinutes > limit;
};

/**
 * Attaches derived fields (not persisted in MongoDB) to a ticket document.
 */
export const enrichTicket = (ticket) => {
  const plain = ticket.toObject ? ticket.toObject() : { ...ticket };

  return {
    ...plain,
    ageMinutes: getAgeMinutes(plain),
    slaBreached: isSlaBreached(plain),
  };
};
