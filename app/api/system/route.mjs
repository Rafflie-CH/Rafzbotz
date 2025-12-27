export async function GET() {
  const s = global.botStats || {}

  return Response.json({
    ping: s.ping || 0,
    botUptime: Math.floor(s.botUptime || 0),
    vpsUptime: Math.floor(s.vpsUptime || 0),
    totalRam: Math.round((s.totalRam || 0) / 1024 / 1024),
    totalDisk: s.totalDisk || 0,
    cpu: s.cpu || 0
  })
}
