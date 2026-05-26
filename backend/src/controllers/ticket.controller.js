import * as ticketService from '../services/ticket.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createTicket = asyncHandler(async (req, res) => {
  const ticket = await ticketService.createTicket(req.body);

  res.status(201).json({
    success: true,
    data: ticket,
  });
});

export const getTickets = asyncHandler(async (req, res) => {
  const filters = {
    status: req.query.status,
    priority: req.query.priority,
    breached: req.query.breached === 'true' ? true : undefined,
  };

  const tickets = await ticketService.getTickets(filters);

  res.status(200).json({
    success: true,
    data: tickets,
  });
});

export const updateTicketStatus = asyncHandler(async (req, res) => {
  const ticket = await ticketService.updateTicketStatus(req.params.id, req.body.status);

  res.status(200).json({
    success: true,
    data: ticket,
  });
});

export const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await ticketService.deleteTicket(req.params.id);

  res.status(200).json({
    success: true,
    data: ticket,
  });
});

export const getTicketStats = asyncHandler(async (_req, res) => {
  const stats = await ticketService.getTicketStats();

  res.status(200).json({
    success: true,
    data: stats,
  });
});
