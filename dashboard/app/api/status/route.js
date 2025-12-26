module.exports = async () =>
  Response.json({ status: global.botStatus || "OFF" })
