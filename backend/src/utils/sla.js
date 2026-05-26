/**
 * SLA limits per priority, stored in minutes per requirements.
 */
export const SLA_MINUTES = {
  urgent: 60,
  high: 240,
  medium: 1440,
  low: 4320,
};

/**
 * Returns the SLA window in minutes for a given priority.
 */
export const getSlaLimitMinutes = (priority) => SLA_MINUTES[priority];
