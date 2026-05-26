import { Router } from 'express';
import * as ticketController from '../controllers/ticket.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createTicketSchema,
  listTicketsQuerySchema,
  updateStatusSchema,
} from '../validations/ticket.validation.js';

const router = Router();

// Stats must be registered before /:id-style routes on the same verb
router.get('/stats', ticketController.getTicketStats);

router.post('/', validate(createTicketSchema), ticketController.createTicket);

router.get('/', validate(listTicketsQuerySchema, 'query'), ticketController.getTickets);

router.patch('/:id', validate(updateStatusSchema), ticketController.updateTicketStatus);

router.delete('/:id', ticketController.deleteTicket);

export default router;
