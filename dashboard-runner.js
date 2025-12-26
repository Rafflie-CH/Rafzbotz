const { spawn } = require("child_process")

global.botProcess = null
global.botStatus = "OFF"
global.botLogs = []

function pushLog(text) {
  global.botLogs.push(`[${new Date().toLocaleTimeString()}] ${text}`)
  if (global.botLogs.length > 300) global.botLogs.shift()
}

function startBot(pairingNumber) {
  if (global.botProcess) return

  const env = { ...process.env }
  if (pairingNumber) env.PAIRING_NUMBER = pairingNumber

  global.botProcess = spawn("node", ["index.js"], {
    env,
    stdio: ["ignore", "pipe", "pipe"]
  })

  global.botStatus = "ON"
  pushLog("Bot started")

  global.botProcess.stdout.on("data", d => pushLog(d.toString()))
  global.botProcess.stderr.on("data", d => pushLog("ERR: " + d.toString()))

  global.botProcess.on("exit", c => {
    pushLog("Bot exited code " + c)
    global.botProcess = null
    global.botStatus = "OFF"
  })
}

function stopBot() {
  if (!global.botProcess) return
  pushLog("Bot stopped by owner")
  global.botProcess.kill("SIGTERM")
  global.botProcess = null
  global.botStatus = "OFF"
}

module.exports = { startBot, stopBot }
