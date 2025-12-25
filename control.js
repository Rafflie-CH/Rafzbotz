const express = require("express")
const { spawn } = require("child_process")

const app = express()

let botProcess = null
let status = "OFF" // OFF | ON | RESTARTING
let serverStarted = false

function startServer() {
  if (serverStarted) return
  serverStarted = true

  app.listen(3000, () => {
    console.log("🔌 Control server running on port 3000")
  })
}

function startBot() {
  if (botProcess) return

  status = "ON"

  botProcess = spawn("npm", ["start"], {
    stdio: "inherit",
    shell: true
  })

  botProcess.on("exit", () => {
    botProcess = null
    status = "OFF"
  })
  setTimeout(() => {
    startServer()
  }, 3000)
}

function stopBot() {
  if (!botProcess) return
  status = "OFF"
  botProcess.kill("SIGTERM")
  botProcess = null
}

app.get("/start", (req, res) => {
  if (status === "ON") {
    return res.json({ status })
  }
  startBot()
  res.json({ status })
})

app.get("/stop", (req, res) => {
  if (status === "OFF") {
    return res.json({ status })
  }
  stopBot()
  res.json({ status })
})

app.get("/restart", (req, res) => {
  status = "RESTARTING"
  stopBot()
  setTimeout(() => startBot(), 2000)
  res.json({ status })
})

app.get("/status", (req, res) => {
  res.json({ status })
})
