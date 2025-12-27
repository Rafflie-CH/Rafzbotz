import { getIP } from "../../lib/auth"

module.exports = async function GET(req) {
  return Response.json({ ip: getIP(req) })
}
