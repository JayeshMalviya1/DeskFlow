import axios from 'axios';
import { API_BASE_URL } from '../config/apiBase.js';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

const unwrap = (response) => {
  const { data } = response;

  if (!data?.success) {
    throw new Error(data?.message || 'Unexpected API response');
  }

  return data.data;
};

const toError = (error) => {
  if (error.code === 'ECONNABORTED') {
    throw new Error(
      `API timed out (${API_BASE_URL}). Render free tier may be waking up — wait 30s and retry.`
    );
  }

  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }

  if (error.request && !error.response) {
    throw new Error(
      `Cannot reach API at ${API_BASE_URL}. Check Vercel env VITE_API_URL and that Render is running.`
    );
  }

  throw new Error(error.message || 'Request failed');
};

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
