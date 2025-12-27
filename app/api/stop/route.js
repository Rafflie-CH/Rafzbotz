import { stopBot } from "@/dashboard-runner.js"
import { isOwner } from "../../lib/auth"

module.exports = async function POST(req) {
  if (!isOwner(req)) return new Response("Forbidden", { status: 403 })
  stopBot()
  return Response.json({ ok: true })
}
