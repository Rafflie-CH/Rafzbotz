"use client"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const [status, setStatus] = useState("OFF")
  const [logs, setLogs] = useState([])
  const [owner, setOwner] = useState(false)
  const [notif, setNotif] = useState("")
  const [showLogs, setShowLogs] = useState(false)

  const notify = (t) => {
    setNotif(t)
    setTimeout(() => setNotif(""), 3000)
  }

  const refresh = async () => {
    const s = await fetch("/dashboard/api/status").then(r => r.json())
    setStatus(s.status)

    const l = await fetch("/dashboard/api/logs")
    if (l.ok) {
      setOwner(true)
      setLogs((await l.json()).logs)
    }
  }

  useEffect(() => {
    refresh()
    const i = setInterval(refresh, 2500)
    return () => clearInterval(i)
  }, [])

  const act = async (a) => {
    await fetch(`/dashboard/api/${a}`, { method: "POST" })
    notify(`Action ${a.toUpperCase()} executed`)
  }

  return (
    <div className="bg">
      <div className="panel glass">
        <h1>WA Bot Control</h1>

        <p className="status">
          Status: <span className={status === "ON" ? "on" : "off"}>{status}</span>
        </p>

        <div className="buttons">
          <button className="rgb" onClick={() => act("start")}>START</button>
          {owner && (
            <button className="rgb danger" onClick={() => act("stop")}>STOP</button>
          )}
        </div>

        {owner && (
          <>
            <button className="toggle" onClick={() => setShowLogs(!showLogs)}>
              {showLogs ? "Hide Logs" : "Show Logs"}
            </button>

            {showLogs && (
              <pre className="logbox">
                {logs.join("") || "No logs"}
              </pre>
            )}
          </>
        )}
      </div>

      {notif && <div className="notif">{notif}</div>}

      {/* STYLE */}
      <style jsx>{`
        .bg {
          min-height: 100vh;
          background: radial-gradient(circle at top, #0b1d3a, #020617);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .panel {
          width: 100%;
          max-width: 520px;
          padding: 24px;
          border-radius: 20px;
          color: white;
        }

        .glass {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,0.15);
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }

        h1 {
          margin-bottom: 10px;
        }

        .status {
          margin-bottom: 20px;
        }

        .on { color: #4ade80 }
        .off { color: #f87171 }

        .buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .rgb {
          flex: 1;
          padding: 14px;
          border-radius: 14px;
          color: white;
          background: linear-gradient(#020617, #020617) padding-box,
            linear-gradient(120deg, red, cyan, lime, magenta, red) border-box;
          border: 2px solid transparent;
          animation: rgb 4s linear infinite;
        }

        .danger {
          filter: hue-rotate(160deg);
        }

        @keyframes rgb {
          0% { background-position: 0% }
          100% { background-position: 400% }
        }

        .toggle {
          margin-top: 16px;
          width: 100%;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 10px;
          border-radius: 10px;
        }

        .logbox {
          margin-top: 12px;
          max-height: 260px;
          overflow: auto;
          background: rgba(0,0,0,0.4);
          padding: 12px;
          border-radius: 12px;
          font-family: monospace;
          font-size: 12px;
          color: #4ade80;
        }

        .notif {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(10px);
          padding: 14px 18px;
          border-radius: 14px;
          animation: slide 0.5s ease;
        }

        @keyframes slide {
          from { transform: translateX(120%); opacity: 0 }
          to { transform: translateX(0); opacity: 1 }
        }

        @media (min-width: 768px) {
          .panel {
            max-width: 700px;
          }
        }
      `}</style>
    </div>
  )
}
