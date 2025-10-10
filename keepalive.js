const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("✅ Rafz Bot aktif di Replit!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Keepalive server running on port ${PORT}`));
