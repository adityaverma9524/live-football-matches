const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const path = require('path');

const app = express();
const PORT = 3000;
const API_KEY = 'b0ec7f9a16e44ac1bafaa44fd540984d';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/matches', async (req, res) => {
  try {
    const today = new Date();
    const dateFrom = today.toISOString().split('T')[0];
    const dateTo = new Date(today.setDate(today.getDate() + 9)).toISOString().split('T')[0];

    const response = await fetch(`https://api.football-data.org/v4/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`, {
      headers: { 'X-Auth-Token': API_KEY }
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).send(error);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});