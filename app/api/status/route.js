export async function GET() {
  return Response.json({
    status: global.botStatus || "OFF"
  })
}
