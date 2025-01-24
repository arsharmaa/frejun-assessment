const express = require('express');
const { bookTicket, cancelTicket, getBookedTickets, getAvailableTickets, getSeatCounts } = require('../controllers/ticketController');
const router = express.Router();

/**
 * @swagger
 * /api/v1/tickets/book:
 *   post:
 *     summary: Book a new ticket
 *     description: Book a new ticket for a passenger
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *               isLadyWithChild:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Ticket booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 ticket:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     status:
 *                       type: string
 *                     passengerId:
 *                       type: integer
 *                     berthType:
 *                       type: string
 *                     seatNumber:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 */
router.post('/book', bookTicket);

/**
 * @swagger
 * /api/v1/tickets/cancel/{ticketId}:
 *   post:
 *     summary: Cancel a ticket
 *     description: Cancel a ticket by ID
 *     parameters:
 *       - name: ticketId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket canceled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/cancel/:ticketId', cancelTicket);

/**
 * @swagger
 * /api/v1/tickets/booked:
 *   get:
 *     summary: Get booked tickets
 *     description: Retrieve all booked tickets
 *     responses:
 *       200:
 *         description: List of booked tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   passengerId:
 *                     type: integer
 *                   berthType:
 *                     type: string
 *                   seatNumber:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
router.get('/booked', getBookedTickets);

/**
 * @swagger
 * /api/v1/tickets/available:
 *   get:
 *     summary: Get available tickets
 *     description: Retrieve count of available tickets
 *     responses:
 *       200:
 *         description: Available ticket counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 confirmedBerthsCount:
 *                   type: integer
 *                 racCount:
 *                   type: integer
 *                 waitingCount:
 *                   type: integer
 */
router.get('/available', getAvailableTickets);

/**
 * @swagger
 * /api/v1/tickets/counts:
 *   get:
 *     summary: Get ticket counts
 *     description: Retrieve counts of confirmed, RAC, and waiting list tickets
 *     responses:
 *       200:
 *         description: Ticket counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 confirmedCount:
 *                   type: integer
 *                 racCount:
 *                   type: integer
 *                 waitingCount:
 *                   type: integer
 */
router.get('/counts', getSeatCounts);

module.exports = router;
