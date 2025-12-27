const { headers } = require("next/headers")

export function getIP() {
  const h = headers()
  return (
    h.get("x-forwarded-for")?.split(",")[0] ||
    h.get("x-real-ip") ||
    "0.0.0.0"
  )
}

export function isOwner() {
  const ip = getIP()
  const owners = (process.env.OWNER_IPS || "")
    .split(",")
    .map(v => v.trim())

  return owners.includes(ip)
}
