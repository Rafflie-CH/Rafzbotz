export async function GET(req) {
  return Response.json({
    ip: req.headers.get("x-forwarded-for") || "Unknown"
  })
}
