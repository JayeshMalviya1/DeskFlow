/**
 * Computes ticket age in whole minutes.
 *
 * - Unresolved tickets: minutes from createdAt until now.
 * - Resolved or closed tickets with resolvedAt: minutes from createdAt until resolvedAt
 *   (age stops increasing once resolved).
 */
export const getAgeMinutes = (ticket) => {
  const createdAt = new Date(ticket.createdAt);
  const isFrozen =
    (ticket.status === 'resolved' || ticket.status === 'closed') && ticket.resolvedAt;

  const endAt = isFrozen ? new Date(ticket.resolvedAt) : new Date();

  const diffMs = endAt.getTime() - createdAt.getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
};
