const express = require('express');
const cors = require('cors');
const itemsRoutes = require('./routes/items.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Rutele principale pentru inventar
app.use('/api/items', itemsRoutes);

// Ruta pentru endpoint-uri inexistente
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta solicitată nu există.' });
});

// Middleware-ul centralizat de erori
app.use(errorHandler);

module.exports = app;
