"use client"
import { useEffect, useRef, useState } from "react"

export default function Dashboard() {
  const [status, setStatus] = useState("OFF")
  const [uptime, setUptime] = useState(0)
  const [logs, setLogs] = useState([])
  const [owner, setOwner] = useState(false)
  const [notif, setNotif] = useState(null)
  const [loading, setLoading] = useState(false)
  const [number, setNumber] = useState("")
  const [showLogs, setShowLogs] = useState(false)
  const [pauseLogs, setPauseLogs] = useState(false)
  const [newIp, setNewIp] = useState("")

  // 🔹 SYSTEM STATS
  const [sys, setSys] = useState({
    ping: 0,
    botUptime: 0,
    vpsUptime: 0,
    totalRam: 0,
    totalDisk: 0,
    cpu: 0
  })

  const logRef = useRef(null)
  const uptimeRef = useRef(null)

  /* ===== TOAST ===== */
  const toast = (msg, type = "ok") => {
    setNotif({ msg, type })
    setTimeout(() => setNotif(null), 3500)
  }

  /* ===== REFRESH ===== */
  const refresh = async () => {
    if (pauseLogs) return
    try {
      const s = await fetch("/dashboard/api/status").then(r => r.json())
      setStatus(s.status)

      if (s.status === "ON" && !uptimeRef.current)
        uptimeRef.current = Date.now()

      if (s.status === "OFF") {
        uptimeRef.current = null
        setUptime(0)
      }

      const l = await fetch("/dashboard/api/logs")
      if (l.ok) {
        setOwner(true)
        setLogs((await l.json()).logs || [])
      }

      // 🔹 FETCH SYSTEM STATS
      const sysRes = await fetch("/dashboard/api/system")
      if (sysRes.ok) setSys(await sysRes.json())

    } catch {}
  }

  useEffect(() => {
    refresh()
    const i = setInterval(refresh, 2000)
    return () => clearInterval(i)
  }, [pauseLogs])

  /* ===== UPTIME ===== */
  useEffect(() => {
    const t = setInterval(() => {
      if (uptimeRef.current)
        setUptime(Math.floor((Date.now() - uptimeRef.current) / 1000))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  /* ===== LOG SCROLL ===== */
  useEffect(() => {
    if (logRef.current)
      logRef.current.scrollTo({
        top: logRef.current.scrollHeight,
        behavior: "smooth"
      })
  }, [logs])

  /* ===== POST ===== */
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
      toast("Action failed", "err")
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
      toast("IP added")
      setNewIp("")
    } catch {
      toast("Failed", "err")
    }
  }

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar glass">
        <h2>RafzBot</h2>
        <button className="active">Dashboard</button>
        <button disabled>Logs</button>
        <button disabled>Settings</button>
      </aside>

      {/* MAIN */}
      <main className="main">
        <div className="card glass">
          <header>
            <div>
              <h1>WA Bot Control</h1>
              <small>Uptime: {uptime}s</small>
            </div>

            <div className={`status ${status}`}>
              <span /> {status}
            </div>
          </header>

          {/* 🔥 SYSTEM STATS */}
          <div className="stats">
            <Stat label="Ping" value={`${sys.ping} ms`} percent={Math.min(sys.ping * 10, 100)} />
            <Stat label="Bot Uptime" value={`${Math.floor(sys.botUptime / 60)} min`} percent={100} />
            <Stat label="VPS Uptime" value={`${Math.floor(sys.vpsUptime / 3600)} h`} percent={100} />
            <Stat label="RAM" value={`${sys.totalRam} MB`} percent={sys.totalRam / 100} />
            <Stat label="Disk" value={`${sys.totalDisk} GB`} percent={sys.totalDisk} />
            <Stat label="CPU" value={`${sys.cpu} Core`} percent={sys.cpu * 10} />
          </div>

          {/* ACTIONS */}
          <div className="actions">
            <button className={`rgb ${status==="ON"?"on":""}`}
              disabled={loading}
              onClick={() => post("/dashboard/api/start")}>
              {loading ? "Loading..." : "START"}
            </button>

            {owner && (
              <button className="rgb danger"
                disabled={loading}
                onClick={() => post("/dashboard/api/stop")}>
                STOP
              </button>
            )}
          </div>

          {owner && (
            <>
              <input className="input"
                placeholder="+62xxxx"
                value={number}
                onChange={e => setNumber(e.target.value)} />

              <button className="rgb"
                onClick={() => post("/dashboard/api/pair", { number })}>
                PAIR NUMBER
              </button>

              <div className="ownerBox">
                <input className="input"
                  placeholder="Add owner IP"
                  value={newIp}
                  onChange={e => setNewIp(e.target.value)} />
                <button className="rgb mini" onClick={addOwnerIp}>
                  ADD IP
                </button>
              </div>

              <div className="logActions">
                <button className="toggle" onClick={() => setShowLogs(!showLogs)}>
                  {showLogs ? "Hide Logs" : "Show Logs"}
                </button>

                <button className="toggle"
                  onClick={() => setPauseLogs(!pauseLogs)}>
                  {pauseLogs ? "▶ Resume" : "⏸ Pause"}
                </button>

                <button className="toggle danger"
                  onClick={() => setLogs([])}>
                  Clear
                </button>
              </div>

              {showLogs && (
                <div className="logbox" ref={logRef}>
                  {logs.length === 0 && "No logs"}
                  {logs.map((l, i) => (
                    <div key={i}
                      className={`logline ${/err|fail/i.test(l)?"err":"ok"}`}>
                      {l}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {notif && <div className={`toast ${notif.type}`}>{notif.msg}</div>}

      <style jsx>{`
        *{box-sizing:border-box}

        .layout{
          min-height:100vh;
          display:flex;
          background:radial-gradient(circle at top,#0b1435,#020617);
          color:#e5e7eb;
        }

        .glass{
          background:rgba(20,25,50,.65);
          backdrop-filter:blur(24px);
          border:1px solid rgba(255,255,255,.15);
          box-shadow:0 30px 80px rgba(0,0,0,.65);
        }

        .sidebar{width:240px;padding:26px}
        .sidebar button{
          width:100%;padding:12px;margin-bottom:10px;
          border-radius:14px;background:transparent;
          border:1px solid rgba(255,255,255,.2);color:white;
        }
        .sidebar .active{background:rgba(255,255,255,.12)}

        .main{flex:1;padding:40px;display:flex;justify-content:center}

        .card{width:100%;max-width:900px;padding:30px;border-radius:28px}

        header{display:flex;justify-content:space-between;margin-bottom:18px}

        .status span{
          width:10px;height:10px;border-radius:50%;
          background:${status==="ON"?"#22c55e":"#ef4444"};
          animation:pulse 1.6s infinite;
          box-shadow:0 0 14px currentColor;
        }

        .stats{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(150px,1fr));
          gap:14px;
          margin-bottom:20px;
        }

        .stat{background:rgba(0,0,0,.45);padding:14px;border-radius:16px}
        .statTop{display:flex;justify-content:space-between;font-size:13px;margin-bottom:8px}
        .bar{height:8px;background:rgba(255,255,255,.15);border-radius:999px;overflow:hidden}
        .fill{
          height:100%;
          background:linear-gradient(90deg,#00fff0,#7f5cff,#ff4ecd,#22c55e);
          background-size:300%;
          animation:rgb 4s linear infinite;
        }

        .actions{display:flex;gap:16px;margin-bottom:14px}

        .rgb{
          flex:1;padding:15px;border-radius:18px;border:2px solid transparent;
          background:
            linear-gradient(#020617,#020617) padding-box,
            linear-gradient(120deg,#00fff0,#7f5cff,#ff4ecd,#22c55e,#00fff0) border-box;
          background-size:300%;
          animation:rgb 6s linear infinite,hue 8s linear infinite;
        }

        .rgb.on{filter:drop-shadow(0 0 12px #22c55e)}
        .danger{filter:hue-rotate(160deg)}

        .input{width:100%;margin-top:12px;padding:13px;border-radius:14px;
          background:rgba(0,0,0,.45);border:none;color:white}

        .ownerBox{display:flex;gap:10px;margin-top:12px}
        .logActions{display:flex;gap:10px;margin-top:14px}

        .toggle{flex:1;padding:10px;border-radius:14px;
          background:transparent;border:1px solid rgba(255,255,255,.25)}

        .logbox{margin-top:14px;max-height:340px;overflow:auto;
          background:rgba(0,0,0,.65);padding:16px;border-radius:18px;font-family:monospace}

        .logline{animation:logIn .25s ease}
        .logline.ok{color:#4ade80}
        .logline.err{color:#f87171}

        .toast{position:fixed;bottom:24px;right:24px;padding:14px 18px;
          border-radius:16px;background:rgba(0,0,0,.7)}

        @keyframes rgb{to{background-position:300%}}
        @keyframes hue{to{filter:hue-rotate(360deg)}}
        @keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.6)}100%{transform:scale(1)}}
        @keyframes logIn{from{opacity:0;transform:translateY(6px)}to{opacity:1}}

        @media(max-width:768px){
          .layout{flex-direction:column}
          .sidebar{width:100%;display:flex;justify-content:space-around}
          .main{padding:20px}
        }
      `}</style>
    </div>
  )
}

function Stat({ label, value, percent }) {
  return (
    <div className="stat">
      <div className="statTop">
        <span>{label}</span>
        <b>{value}</b>
      </div>
      <div className="bar">
        <div className="fill" style={{ width: `${Math.min(percent,100)}%` }} />
      </div>
    </div>
  )
}
