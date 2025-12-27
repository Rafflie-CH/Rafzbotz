import { getIP } from "../../lib/auth.mjs"

module.exports = async function GET(req) {
  return Response.json({ ip: getIP(req) })
}
