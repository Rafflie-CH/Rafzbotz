const { isOwner } = require("../../lib/auth")

export async function POST(req) {
  if (!isOwner())
    return new Response("Forbidden", { status: 403 })

  const { ip } = await req.json()
  if (!ip) return new Response("Invalid IP", { status: 400 })

  // NOTE:
  // di vercel ENV GA BISA ditulis ulang runtime
  // jadi ini **simulasi UI**
  // aslinya lu copy IP → tambah manual ke ENV

  return Response.json({
    ok: true,
    note: "Add IP manually to Vercel ENV: OWNER_IPS"
  })
}
