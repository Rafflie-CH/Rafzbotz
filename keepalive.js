const express = require('express');
const app = express();
const PORT = process.env.PORT || 0; // 0 biar sistem pilih port acak

if (!process.env.LISTEN_STARTED) {
  process.env.LISTEN_STARTED = true;
  app.listen(PORT, () => console.log(`Keepalive server running on port ${PORT}`));
}

setInterval(() => {
  require("node-fetch")(`https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`).catch(() => {});
}, 5 * 60 * 1000);
