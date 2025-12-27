import { startBot } from "@/dashboard-runner.js"
import { isOwner } from "../../lib/auth.mjs"

module.exports = async function POST(req) {
  if (!isOwner(req)) return new Response("Forbidden", { status: 403 })

  const { number } = await req.json()
  startBot(number)

  return Response.json({ ok: true })
}
