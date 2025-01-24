const express = require('express');
const { bookTicket, cancelTicket, getBookedTickets, getAvailableTickets, getSeatCounts } = require('../controllers/ticketController');
const router = express.Router();

router.post('/book', bookTicket);
router.post('/cancel/:ticketId', cancelTicket);
router.get('/booked', getBookedTickets);
router.get('/available', getAvailableTickets);
router.get('/counts', getSeatCounts);

module.exports = router;
