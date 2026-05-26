import Joi from 'joi';
import { PRIORITIES, STATUSES } from '../models/ticket.model.js';

/**
 * POST /tickets — create payload validation.
 */
export const createTicketSchema = Joi.object({
  subject: Joi.string().trim().required().messages({
    'any.required': 'Subject is required',
    'string.empty': 'Subject is required',
  }),
  description: Joi.string().trim().required().messages({
    'any.required': 'Description is required',
    'string.empty': 'Description is required',
  }),
  customerEmail: Joi.string().email().required().messages({
    'any.required': 'Customer email is required',
    'string.email': 'Customer email must be a valid email',
    'string.empty': 'Customer email is required',
  }),
  priority: Joi.string()
    .valid(...PRIORITIES)
    .required()
    .messages({
      'any.required': 'Priority is required',
      'any.only': 'Invalid priority',
    }),
}).options({ stripUnknown: true });

/**
 * PATCH /tickets/:id — status-only updates.
 */
export const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...STATUSES)
    .required()
    .messages({
      'any.required': 'Status is required',
      'any.only': 'Invalid status',
    }),
}).options({ stripUnknown: true });

/**
 * GET /tickets — optional query filters (combinable).
 */
export const listTicketsQuerySchema = Joi.object({
  status: Joi.string()
    .valid(...STATUSES)
    .messages({ 'any.only': 'Invalid status' }),
  priority: Joi.string()
    .valid(...PRIORITIES)
    .messages({ 'any.only': 'Invalid priority' }),
  breached: Joi.string().valid('true').messages({
    'any.only': 'breached must be true when provided',
  }),
})
  .options({ stripUnknown: true })
  .unknown(false);
