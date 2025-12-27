"use client"
import { useEffect, useRef, useState } from "react"

export default function Dashboard() {
  const [status, setStatus] = useState("OFF")
  const [logs, setLogs] = useState([])
  const [owner, setOwner] = useState(false)
  const [notif, setNotif] = useState(null)
  const [loading, setLoading] = useState(false)
  const [number, setNumber] = useState("")
  const [showLogs, setShowLogs] = useState(false)
  const [newIp, setNewIp] = useState("")
  const logRef = useRef(null)

  const toast = (msg, type = "ok") => {
    setNotif({ msg, type })
    setTimeout(() => setNotif(null), 3500)
  }

  const refresh = async () => {
    try {
      const s = await fetch("/dashboard/api/status").then(r => r.json())
      setStatus(s.status)

      const l = await fetch("/dashboard/api/logs")
      if (l.ok) {
        setOwner(true)
        setLogs((await l.json()).logs)
      }
    } catch {}
  }

  useEffect(() => {
    refresh()
    const i = setInterval(refresh, 2500)
    return () => clearInterval(i)
  }, [])

  useEffect(() => {
    if (logRef.current)
      logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs])

  const post = async (url, body) => {
    try {
      setLoading(true)
      const r = await fetch(url, {
        method: "POST",
        body: body ? JSON.stringify(body) : null
      })
      if (!r.ok) throw 0
      toast("Success")
      refresh()
    } catch {
      toast("Error", "err")
    } finally {
      setLoading(false)
    }
  }

  const addOwnerIp = async () => {
    try {
      const r = await fetch("/dashboard/api/add-owner", {
        method: "POST",
        body: JSON.stringify({ ip: newIp })
      })
      if (!r.ok) throw 0
      toast("IP noted (add to ENV)")
      setNewIp("")
    } catch {
      toast("Failed", "err")
    }
  }

  return (
    <div className="bg">
      <div className="card glass">
        <header>
          <h1>WA Bot Control</h1>
          <div className={`status ${status}`}>
            <span /> {status}
          </div>
        </header>

        <div className="actions">
          <button className="rgb" disabled={loading}
            onClick={() => post("/dashboard/api/start")}>
            START
          </button>

          {owner && (
            <button className="rgb danger" disabled={loading}
              onClick={() => post("/dashboard/api/stop")}>
              STOP
            </button>
          )}
        </div>

        {owner && (
          <>
            <input
              className="input"
              placeholder="+62xxxx"
              value={number}
              onChange={e => setNumber(e.target.value)}
            />

            <button className="rgb"
              onClick={() => post("/dashboard/api/pair", { number })}>
              PAIR NUMBER
            </button>

            <div className="ownerBox">
              <input
                className="input"
                placeholder="Add owner IP"
                value={newIp}
                onChange={e => setNewIp(e.target.value)}
              />
              <button className="rgb mini" onClick={addOwnerIp}>
                ADD IP
              </button>
            </div>

            <button className="toggle"
              onClick={() => setShowLogs(!showLogs)}>
              {showLogs ? "Hide Logs" : "Show Logs"}
            </button>

            {showLogs && (
              <pre className="logbox" ref={logRef}>
                {logs.join("") || "No logs"}
              </pre>
            )}
          </>
        )}
      </div>

      {notif && (
        <div className={`toast ${notif.type}`}>
          {notif.msg}
        </div>
      )}

      <style jsx>{`
        .bg{
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          background:
            radial-gradient(circle at top,#0b1435,#020617);
        }

        .glass{
          background:rgba(20,25,50,.6);
          backdrop-filter:blur(20px);
          border:1px solid rgba(255,255,255,.1);
        }

        .card{
          width:100%;
          max-width:640px;
          padding:26px;
          border-radius:24px;
          color:#e5e7eb;
        }

        header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:18px;
        }

        .status span{
          width:10px;height:10px;border-radius:50%;
          background:${status === "ON" ? "#22c55e" : "#ef4444"};
          box-shadow:0 0 10px currentColor;
          margin-right:8px;
        }

        .actions{display:flex;gap:14px}

        .rgb{
          flex:1;
          padding:14px;
          border-radius:16px;
          border:2px solid transparent;
          color:white;
          font-weight:700;
          background:
            linear-gradient(#020617,#020617) padding-box,
            linear-gradient(120deg,#00fff0,#7f5cff,#ff4ecd,#22c55e,#00fff0) border-box;
          background-size:300%;
          animation:rgb 6s linear infinite,hue 8s linear infinite;
        }

        .danger{filter:hue-rotate(160deg)}
        .mini{flex:0 0 auto;padding:10px 14px}

        .input{
          width:100%;
          margin-top:10px;
          padding:12px;
          border-radius:14px;
          background:rgba(0,0,0,.4);
          border:none;
          color:white;
        }

        .ownerBox{display:flex;gap:10px;margin-top:10px}

        .toggle{
          margin-top:12px;
          width:100%;
          padding:10px;
          border-radius:14px;
          border:1px solid rgba(255,255,255,.25);
          background:transparent;
        }

        .logbox{
          margin-top:12px;
          max-height:260px;
          overflow:auto;
          background:rgba(0,0,0,.55);
          padding:14px;
          border-radius:16px;
          font-family:monospace;
          font-size:12px;
          color:#4ade80;
        }

        .toast{
          position:fixed;
          bottom:24px;
          right:24px;
          padding:14px 18px;
          border-radius:16px;
          backdrop-filter:blur(12px);
          background:rgba(0,0,0,.6);
        }

        .toast.err{background:rgba(239,68,68,.25)}

        @keyframes rgb{to{background-position:300%}}
        @keyframes hue{to{filter:hue-rotate(360deg)}}
      `}</style>
    </div>
  )
}
