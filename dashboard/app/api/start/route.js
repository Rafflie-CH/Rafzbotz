const { startBot } = require("../../../../dashboard-runner")

module.exports = async function POST() {
  startBot()
  return Response.json({ ok: true })
}
