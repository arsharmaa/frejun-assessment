const express = require('express');
const ticketRoutes = require('./routes/ticket');
const app = express();

app.use(express.json());
app.use('/api/v1/tickets', ticketRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
