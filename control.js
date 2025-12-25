const express = require("express")
const { spawn } = require("child_process")

const app = express()

let botProcess = null
let isRestarting = false

// ===== Helper: status REAL dari process =====
function getStatus() {
  if (!botProcess) return "OFF"
  if (botProcess.killed) return "OFF"
  return isRestarting ? "RESTARTING" : "ON"
}

// ===== Start bot (ANTI DOUBLE SPAWN) =====
function startBot() {
  if (botProcess || isRestarting) return

  botProcess = spawn("npm", ["start"], {
    stdio: "inherit",
    shell: true
  })

  botProcess.once("exit", () => {
    botProcess = null
    isRestarting = false
  })
}

// ===== Stop bot (TUNGGU EXIT) =====
function stopBot(cb) {
  if (!botProcess) {
    cb && cb()
    return
  }

  botProcess.once("exit", () => {
    botProcess = null
    isRestarting = false
    cb && cb()
  })

  // SIGTERM dulu biar Baileys nutup rapi
  botProcess.kill("SIGTERM")
}

// ===== API =====
app.get("/start", (req, res) => {
  startBot()
  res.json({ status: getStatus() })
})

app.get("/stop", (req, res) => {
  stopBot()
  res.json({ status: getStatus() })
})

app.get("/restart", (req, res) => {
  if (!botProcess) {
    // kalau OFF, start aja
    startBot()
    return res.json({ status: getStatus() })
  }

  isRestarting = true
  stopBot(() => {
    setTimeout(startBot, 1500) // kasih napas
  })

  res.json({ status: "RESTARTING" })
})

app.get("/status", (req, res) => {
  res.json({ status: getStatus() })
})

// ===== Control server =====
app.listen(3000, () => {
  console.log("🔌 Control server running on port 3000")
})
