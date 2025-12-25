const express = require("express")
const { spawn } = require("child_process")

const app = express()

let botProcess = null
let status = "OFF" // OFF | ON | STOPPING | RESTARTING
let serverStarted = false

function startServer() {
  if (serverStarted) return
  serverStarted = true
  app.listen(3000, () => {
    console.log("🔌 Control server running on port 3000")
  })
}

function startBot() {
  if (botProcess || status !== "OFF") {
    console.log("⏳ Start ditolak, status:", status)
    return
  }

  status = "ON"
  console.log("▶️ Starting bot...")

  botProcess = spawn("npm", ["start"], {
    stdio: "inherit",
    shell: true
  })

  botProcess.once("exit", () => {
    console.log("⛔ Bot exited")
    botProcess = null
    status = "OFF"
  })

  setTimeout(startServer, 3000)
}

function stopBot(callback) {
  if (!botProcess || status !== "ON") {
    console.log("⏹️ Stop ditolak, status:", status)
    return callback?.()
  }

  status = "STOPPING"
  console.log("⏹️ Stopping bot...")

  botProcess.once("exit", () => {
    console.log("✅ Bot fully stopped")
    botProcess = null
    status = "OFF"
    callback?.()
  })

  botProcess.kill("SIGTERM")
}

/* ================= API ================= */

app.get("/start", (req, res) => {
  startBot()
  res.json({ status })
})

app.get("/stop", (req, res) => {
  stopBot()
  res.json({ status })
})

app.get("/restart", (req, res) => {
  if (status !== "ON") {
    res.json({ status })
    return
  }

  status = "RESTARTING"
  console.log("🔁 Restarting bot...")

  stopBot(() => {
    setTimeout(startBot, 3000)
  })

  res.json({ status })
})

app.get("/status", (req, res) => {
  res.json({ status })
})

/* AUTO START */
startBot()
