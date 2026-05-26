import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

const unwrap = (response) => {
  const { data } = response;
  if (!data?.success) {
    throw new Error(data?.message || 'Request failed');
  }
  return data.data;
};

const toError = (error) => {
  throw new Error(error.response?.data?.message || error.message || 'Request failed');
};

/**
 * GET /tickets — filters: status, priority, breached (boolean → breached=true)
 */
export async function getTickets({ status, priority, breached } = {}) {
  try {
    const params = {};
    if (status) params.status = status;
    if (priority) params.priority = priority;
    if (breached) params.breached = 'true';

    const response = await api.get('/tickets', { params });
    return unwrap(response);
  } catch (error) {
    toError(error);
  }
}

export async function getStats() {
  try {
    const response = await api.get('/tickets/stats');
    return unwrap(response);
  } catch (error) {
    toError(error);
  }
}

export async function createTicket(data) {
  try {
    const response = await api.post('/tickets', data);
    return unwrap(response);
  } catch (error) {
    toError(error);
  }
}

export async function updateTicketStatus(id, newStatus) {
  try {
    const response = await api.patch(`/tickets/${id}`, { status: newStatus });
    return unwrap(response);
  } catch (error) {
    toError(error);
  }
}

export async function deleteTicket(id) {
  try {
    const response = await api.delete(`/tickets/${id}`);
    return unwrap(response);
  } catch (error) {
    toError(error);
  }
}
