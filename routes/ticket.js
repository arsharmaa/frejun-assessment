const express = require('express');
const { bookTicket, cancelTicket, getBookedTickets, getAvailableTickets } = require('../controllers/ticketController');
const router = express.Router();

router.post('/book', bookTicket);
router.post('/cancel/:ticketId', cancelTicket);
router.get('/booked', getBookedTickets);
router.get('/available', getAvailableTickets);

module.exports = router;
