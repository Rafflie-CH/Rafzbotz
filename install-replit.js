const { execSync } = require("child_process")
const fs = require("fs")

const LOCK = ".replit-installed"

if (!process.env.REPL_ID) {
  console.log("💻 Non-Replit environment, skip legacy install")
  process.exit(0)
}

if (fs.existsSync(LOCK)) {
  console.log("✅ Legacy install already done, skip")
  process.exit(0)
}

console.log("🔧 Replit detected")
console.log("📦 Running npm install --legacy-peer-deps")

execSync("npm install --legacy-peer-deps", { stdio: "inherit" })

// 4. Bikin lock
fs.writeFileSync(LOCK, "ok")
console.log("🔒 Lock file created")
