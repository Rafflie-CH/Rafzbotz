const { startBot } = require("../../../../dashboard-runner")
const { isOwner } = require("@/lib/auth")

module.exports = async function POST(req) {
  if (!isOwner(req)) return new Response("Forbidden", { status: 403 })

  const { number } = await req.json()
  startBot(number)

  return Response.json({ ok: true })
}
