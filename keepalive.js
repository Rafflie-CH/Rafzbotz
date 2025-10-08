// keepalive.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// route utama
app.get('/', (req, res) => {
  res.send('Bot aktif — Keepalive berjalan!');
});

app.listen(PORT, () => console.log(`Keepalive server running on port ${PORT}`));

// ping ke diri sendiri setiap 5 menit
setInterval(() => {
  fetch(`https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`).catch(() => {});
}, 5 * 60 * 1000);
