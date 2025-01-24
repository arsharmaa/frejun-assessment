const express = require('express');
const { sequelize } = require('./models');
const { seedBerths } = require('./utils/seed');
const ticketRoutes = require('./routes/ticket');

const app = express();

app.use(express.json());
app.use('/api/v1/tickets', ticketRoutes);
async function initializeApp() {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synced!');
        await seedBerths();
        console.log('Application initialized successfully.');
    } catch (error) {
        console.error('Error initializing application:', error);
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    await initializeApp();
});
