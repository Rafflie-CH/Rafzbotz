import { startBot } from "@/dashboard-runner.js"

module.exports = async function POST() {
  startBot()
  return Response.json({ ok: true })
}
