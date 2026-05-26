/**
 * Allowed status transitions (forward and backward).
 * Any transition not listed here is rejected with HTTP 400.
 */
const ALLOWED_TRANSITIONS = {
  open: ['in_progress'],
  in_progress: ['open', 'resolved'],
  resolved: ['in_progress', 'closed'],
  closed: ['resolved'],
};

/**
 * Validates whether a ticket may move from `fromStatus` to `toStatus`.
 */
export const isValidTransition = (fromStatus, toStatus) => {
  if (fromStatus === toStatus) {
    return false;
  }

  const allowed = ALLOWED_TRANSITIONS[fromStatus];
  return Array.isArray(allowed) && allowed.includes(toStatus);
};
