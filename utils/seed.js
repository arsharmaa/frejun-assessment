const { Berth } = require('../models');

function getSeatType(seatNumber) {
    const modulo = (seatNumber - 1) % 8;
    if (modulo === 0 || modulo === 3) return 'Lower';
    if (modulo === 1 || modulo === 4) return 'Middle';
    if (modulo === 2 || modulo === 5) return 'Upper';
    if (modulo === 6) return 'Side-Lower';
    if (modulo === 7) return 'Side-Upper';
}

async function seedBerths() {
    console.log('Seeding berths...');
    for (let i = 1; i <= 72; i++) {
        const type = getSeatType(i);
        await Berth.create({ seatNumber: i, type, status: 'Available' });
    }
    console.log('Seeding berths completed.');
}

module.exports = { seedBerths };
