const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("✅ Rafzbotz is alive!"));

// Optional: ping diri sendiri tiap 5 menit biar gak sleep
setInterval(() => {
  require("node-fetch")(`https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`).catch(() => {});
}, 5 * 60 * 1000);
