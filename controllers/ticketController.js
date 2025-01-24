const { Op } = require('sequelize');
const { sequelize, Passenger, Ticket, Berth, WaitingList } = require('../models');

async function bookTicket(req, res) {
    const { name, age, gender, isLadyWithChild } = req.body;

    if (!name || !age || !gender) {
        return res.status(400).json({ message: 'Name, age, and gender are required.' });
    }

    try {
        await sequelize.transaction(async (t) => {
            const passenger = await Passenger.create(
                { name, age, gender, isChild: age < 5, isLadyWithChild },
                { transaction: t }
            );

            if (age < 5) {
                return res.status(200).json({
                    message: 'Passenger added successfully without berth allocation',
                    passenger: {
                        id: passenger.id,
                        name: passenger.name,
                        age: passenger.age,
                        gender: passenger.gender,
                        isChild: passenger.isChild,
                        isLadyWithChild: passenger.isLadyWithChild,
                        createdAt: passenger.createdAt,
                        updatedAt: passenger.updatedAt
                    }
                });
            }

            let berth = null;
            let status = 'Confirmed';

            // Allocate berths for elderly or lady with child
            if (age >= 60 || isLadyWithChild) {
                berth = await Berth.findOne({
                    where: { status: 'Available', type: 'Lower' },
                    order: [['seatNumber', 'ASC']],
                    lock: t.LOCK.UPDATE,
                    transaction: t,
                });
            }

            // General seat allocation
            if (!berth) {
                berth = await Berth.findOne({
                    where: {
                        status: 'Available',
                        type: { [Op.in]: ['Middle', 'Upper', 'Side-Upper'] },
                    },
                    order: [['seatNumber', 'ASC']],
                    lock: t.LOCK.UPDATE,
                    transaction: t,
                });
            }

            // Allocate remaining Lower berths
            if (!berth) {
                berth = await Berth.findOne({
                    where: { status: 'Available', type: 'Lower' },
                    order: [['seatNumber', 'ASC']],
                    lock: t.LOCK.UPDATE,
                    transaction: t,
                });
            }

            // Check for RAC (Side-Lower)
            if (!berth) {
                const racCount = await Ticket.count({ where: { status: 'RAC' }, transaction: t });
                if (racCount < 18) {
                    status = 'RAC';
                    berth = await Berth.findOne({
                        where: { type: 'Side-Lower' },
                        order: [['seatNumber', 'ASC']],
                        lock: t.LOCK.UPDATE,
                        transaction: t,
                    });
                } else {
                    status = 'Waiting';
                }
            }

            // Handle Waiting List
            if (!berth && status === 'Waiting') {
                const waitingCount = await WaitingList.count({ transaction: t });
                if (waitingCount >= 10) {
                    throw new Error('No tickets available');
                }
            }

            const ticket = await Ticket.create(
                {
                    status,
                    berthType: berth ? berth.type : null,
                    passengerId: passenger.id,
                    seatNumber: berth ? berth.seatNumber : null,
                },
                { transaction: t }
            );

            if (berth) {
                const berthStatus = status === 'RAC' && berth.status === 'Partially-Occupied' ? 'Occupied' : 'Partially-Occupied';
                await Berth.update(
                    { status: berthStatus, ticketId: berthStatus === 'Occupied' ? ticket.id : berth.ticketId },
                    { where: { id: berth.id }, transaction: t }
                );
            } else {
                await WaitingList.create({ ticketId: ticket.id }, { transaction: t });
            }

            res.status(200).json({
                message: 'Ticket booked successfully',
                ticket: {
                    id: ticket.id,
                    status: ticket.status,
                    passengerId: ticket.passengerId,
                    berthType: ticket.berthType,
                    seatNumber: ticket.seatNumber,
                    createdAt: ticket.createdAt,
                    updatedAt: ticket.updatedAt,
                },
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error booking ticket', error: error.message });
    }
}

async function cancelTicket(req, res) {
    const { ticketId } = req.params;

    try {
        await sequelize.transaction(async (t) => {
            const ticket = await Ticket.findByPk(ticketId, { transaction: t });
            if (!ticket) {
                throw new Error('Ticket not found');
            }

            if (ticket.status === 'Confirmed') {
                await Berth.update(
                    { status: 'Available', ticketId: null },
                    { where: { seatNumber: ticket.seatNumber }, transaction: t }
                );
                const racTicket = await Ticket.findOne({
                    where: { status: 'RAC' },
                    order: [['createdAt', 'ASC']],
                    lock: t.LOCK.UPDATE,
                    transaction: t,
                });

                if (racTicket) {
                    await Ticket.update(
                        {
                            status: 'Confirmed',
                            berthType: ticket.berthType,
                            seatNumber: ticket.seatNumber,
                        },
                        { where: { id: racTicket.id }, transaction: t }
                    );

                    await Berth.update(
                        { status: 'Occupied', ticketId: racTicket.id },
                        { where: { seatNumber: ticket.seatNumber }, transaction: t }
                    );
                    const waitingTicket = await WaitingList.findOne({
                        order: [['createdAt', 'ASC']],
                        lock: t.LOCK.UPDATE,
                        transaction: t,
                    });

                    if (waitingTicket) {
                        await Ticket.update(
                            { status: 'RAC', berthType: 'Side-Lower' },
                            { where: { id: waitingTicket.ticketId }, transaction: t }
                        );
                        await WaitingList.destroy({ where: { id: waitingTicket.id }, transaction: t });
                    }
                }
            } else if (ticket.status === 'RAC') {
                await Berth.update(
                    { status: ticket.berthType === 'Partially-Occupied' ? 'Available' : 'Partially-Occupied', ticketId: null },
                    { where: { ticketId: ticket.id }, transaction: t }
                );
                const waitingTicket = await WaitingList.findOne({
                    order: [['createdAt', 'ASC']],
                    lock: t.LOCK.UPDATE,
                    transaction: t,
                });

                if (waitingTicket) {
                    await Ticket.update(
                        { status: 'RAC', berthType: 'Side-Lower' },
                        { where: { id: waitingTicket.ticketId }, transaction: t }
                    );
                    await WaitingList.destroy({ where: { id: waitingTicket.id }, transaction: t });
                }
            }
            await Ticket.destroy({ where: { id: ticket.id }, transaction: t });
            res.status(200).json({ message: 'Ticket canceled successfully' });
        });
    } catch (error) {
        console.error('Error cancelling ticket:', error);
        res.status(500).json({ message: 'Error canceling ticket', error: error.message });
    }
}

async function getBookedTickets(req, res) {
    try {
        const bookedTickets = await Passenger.findAll({
            include: [{
                model: Ticket,
                required: false,  // Include passengers without tickets as well
                where: {
                    status: { [Op.in]: ['Confirmed', 'RAC'] }
                },
            }],
        });

        res.status(200).json(bookedTickets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booked tickets', error: error.message });
    }
}

async function getAvailableTickets(req, res) {
    try {
        const confirmedTickets = await Ticket.count({
            where: { status: 'Confirmed' }
        });
        const racTickets = await Ticket.count({
            where: { status: 'RAC' }
        });
        const waitingCount = await WaitingList.count();
        const confirmedBerthsCount = Math.max(63 - confirmedTickets, 0);
        const racCount = Math.max(18 - racTickets, 0);
        const waitingListAvailable = Math.max(10 - waitingCount, 0);
        return res.status(200).json({
            confirmedBerthsCount,
            racCount,
            waitingCount: waitingListAvailable
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching available tickets', error: error.message });
    }
}

async function getSeatCounts(req, res) {
    try {
        const confirmedCount = await Ticket.count({
            where: { status: 'Confirmed' }
        });
        const racCount = await Ticket.count({
            where: { status: 'RAC' }
        });
        const waitingCount = await WaitingList.count();
        return res.status(200).json({
            confirmedCount,
            racCount,
            waitingCount
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching seat counts', error: error.message });
    }
}

module.exports = {
    bookTicket,
    cancelTicket,
    getBookedTickets,
    getAvailableTickets,
    getSeatCounts
};