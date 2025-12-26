const { stopBot } = require("@/dashboard-runner.js")
const { isOwner } = require("@/lib/auth")

module.exports = async function POST(req) {
  if (!isOwner(req)) return new Response("Forbidden", { status: 403 })
  stopBot()
  return Response.json({ ok: true })
}
