const OWNER_IP = process.env.OWNER_IP

function isOwner(req) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "0.0.0.0"
  return ip === OWNER_IP
}

module.exports = { isOwner }
