const express = require("express")
const { spawn } = require("child_process")

const app = express()

let botProcess = null
let serverStarted = false
let isRestarting = false

function startServerOnce() {
  if (serverStarted) return
  serverStarted = true

  app.listen(3000, () => {
    console.log("🔌 Control server running on port 3000")
  })
}

function startBot() {
  if (botProcess || isRestarting) return

  console.log("🚀 Starting bot...")

  botProcess = spawn("npm", ["start"], {
    stdio: "inherit", // PENTING: biar bisa input nomor
    shell: true
  })

  // kasih waktu Baileys start + pairing
  setTimeout(() => {
    startServerOnce()
  }, 5000)

  botProcess.once("exit", () => {
    botProcess = null
    isRestarting = false
  })
}

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

  botProcess.kill("SIGTERM")
}

// ===== API =====
app.get("/start", (req, res) => {
  startBot()
  res.json({ status: "ON" })
})

app.get("/stop", (req, res) => {
  stopBot()
  res.json({ status: "OFF" })
})

app.get("/restart", (req, res) => {
  isRestarting = true
  stopBot(() => {
    setTimeout(startBot, 2000)
  })
  res.json({ status: "RESTARTING" })
})

app.get("/status", (req, res) => {
  if (!botProcess) return res.json({ status: "OFF" })
  if (isRestarting) return res.json({ status: "RESTARTING" })
  res.json({ status: "ON" })
})

// ===== JANGAN listen di sini =====
// server hanya dibuka setelah bot start
