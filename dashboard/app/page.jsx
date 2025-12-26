"use client"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const [status, setStatus] = useState("OFF")
  const [logs, setLogs] = useState([])
  const [owner, setOwner] = useState(false)
  const [notif, setNotif] = useState("")
  const [number, setNumber] = useState("")
  const [showLogs, setShowLogs] = useState(false)
  const [myIp, setMyIp] = useState("")

  const notify = (t) => {
    setNotif(t)
    setTimeout(() => setNotif(""), 3000)
  }

  const showMyIp = async () => {
    const res = await fetch("/dashboard/api/my-ip")
    const data = await res.json()

    setMyIp(data.ip)
    notify("Your IP: " + data.ip)
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

  const post = async (url, body) => {
    await fetch(url, {
      method: "POST",
      body: body ? JSON.stringify(body) : null
    })
    notify("Action executed")
    refresh()
  }

  const uploadCreds = async (e) => {
    const f = e.target.files[0]
    if (!f) return

    const fd = new FormData()
    fd.append("file", f)

    await fetch("/dashboard/api/upload-creds", {
      method: "POST",
      body: fd
    })

    notify("Creds uploaded")
  }

  return (
    <div className="bg">
      <div className="panel glass">
        <h1>WA Bot Control</h1>

        <p>Status: <b className={status === "ON" ? "on" : "off"}>{status}</b></p>

        <div className="buttons">
          <button className="rgb" onClick={() => post("/dashboard/api/start")}>
            START
          </button>

          {owner && (
            <button className="rgb danger" onClick={() => post("/dashboard/api/stop")}>
              STOP
            </button>
          )}
        </div>

        <button className="glass btn" onClick={showMyIp}>
      Show My IP
    </button>

        {owner && (
          <>
            <input
              placeholder="+62xxxx"
              value={number}
              onChange={e => setNumber(e.target.value)}
              className="input"
            />

            <button
              className="rgb"
              onClick={() => post("/dashboard/api/pair", { number })}
            >
              PAIR NUMBER
            </button>

            <label className="upload">
              UPLOAD CREDS.JSON
              <input type="file" hidden onChange={uploadCreds} />
            </label>

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
          border-radius: 22px;
          color: white;
        }

        .glass {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.18);
          box-shadow: 0 30px 60px rgba(0,0,0,0.6);
        }

        .buttons {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }

        .rgb {
          flex: 1;
          padding: 14px;
          border-radius: 14px;
          background:
            linear-gradient(#020617, #020617) padding-box,
            linear-gradient(120deg, red, cyan, lime, magenta, red) border-box;
          border: 2px solid transparent;
          animation: rgb 4s linear infinite;
          color: white;
        }

        .danger { filter: hue-rotate(160deg); }

        @keyframes rgb {
          to { background-position: 400%; }
        }

        .input {
          width: 100%;
          margin-top: 10px;
          padding: 10px;
          border-radius: 10px;
          background: rgba(0,0,0,0.4);
          border: none;
          color: white;
        }

        .upload {
          display: block;
          margin-top: 10px;
          padding: 12px;
          text-align: center;
          border-radius: 12px;
          background: rgba(255,255,255,0.1);
        }

        .toggle {
          margin-top: 10px;
          width: 100%;
          padding: 10px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 10px;
        }

        .logbox {
          margin-top: 10px;
          max-height: 260px;
          overflow: auto;
          background: rgba(0,0,0,0.45);
          padding: 12px;
          border-radius: 12px;
          font-family: monospace;
          font-size: 12px;
          color: #4ade80;
        }

        .on { color: #4ade80 }
        .off { color: #f87171 }

        .notif {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(10px);
          padding: 14px 18px;
          border-radius: 14px;
          animation: slide .4s ease;
        }

        .glass.btn {
          padding: 12px;
          border-radius: 14px;
        }

        @keyframes slide {
          from { transform: translateX(120%); opacity: 0 }
          to { transform: translateX(0); opacity: 1 }
        }
      `}</style>
    </div>
  )
}
