const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { sequelize } = require('./models');
const { seedBerths } = require('./utils/seed');
const ticketRoutes = require('./routes/ticket');

const app = express();

app.use(express.json());
app.use('/api/v1/tickets', ticketRoutes);

app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

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
    console.log(`Server running on https://reservation-api-962i.onrender.com/`);
    await initializeApp();
});
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Railway Reservation API',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'https://reservation-api-962i.onrender.com',
                description: 'Deployed API Server'
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
