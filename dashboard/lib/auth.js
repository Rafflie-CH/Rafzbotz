function getIP(req) {
  return (
    req.headers.get("cf-connecting-ip") || // Cloudflare
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    ""
  )
}

function isOwner(req) {
  const raw = process.env.OWNER_IPS || ""
  const list = raw.split(",").map(v => v.trim()).filter(Boolean)
  const ip = getIP(req)

  return list.some(v =>
    v.endsWith(".") ? ip.startsWith(v) : ip === v
  )
}

module.exports = { isOwner, getIP }
