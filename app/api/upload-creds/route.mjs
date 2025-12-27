const fs = require("fs")
const path = require("path")
const { isOwner } = require("../../lib/auth.mjs")

module.exports = async function POST(req) {
  if (!isOwner(req)) return new Response("Forbidden", { status: 403 })

  const form = await req.formData()
  const file = form.get("file")

  if (!file) return new Response("No file", { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const dir = "./session"
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)

  fs.writeFileSync(path.join(dir, "creds.json"), buffer)

  return Response.json({ ok: true })
}
