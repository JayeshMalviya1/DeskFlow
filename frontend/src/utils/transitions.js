/** Allowed status transitions — must match backend rules. */
const ALLOWED = {
  open: ['in_progress'],
  in_progress: ['open', 'resolved'],
  resolved: ['in_progress', 'closed'],
  closed: ['resolved'],
};

/** Button labels per target status (from current status). */
const LABELS = {
  in_progress: '→ In Progress',
  open: '← Open',
  resolved: '→ Resolved',
  closed: '→ Closed',
};

const FORWARD_TARGET = {
  open: 'in_progress',
  in_progress: 'resolved',
  resolved: 'closed',
};

export function isValidTransition(fromStatus, toStatus) {
  if (!fromStatus || !toStatus || fromStatus === toStatus) return false;
  return (ALLOWED[fromStatus] ?? []).includes(toStatus);
}

export function getForwardStatus(currentStatus) {
  return FORWARD_TARGET[currentStatus] ?? null;
}

export function getTransitionActions(currentStatus) {
  return (ALLOWED[currentStatus] ?? []).map((target) => ({
    target,
    label: LABELS[target] ?? target,
    isForward: FORWARD_TARGET[currentStatus] === target,
  }));
}
