import { isOwner } from "../../lib/auth.mjs"
module.exports = async req =>
  isOwner(req)
    ? Response.json({ logs: global.botLogs || [] })
    : new Response("Forbidden", { status: 403 })
