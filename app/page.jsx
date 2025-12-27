"use client"
import { useEffect, useRef, useState } from "react"

export default function Dashboard() {
  /* ===== BASIC STATE ===== */
  const [status, setStatus] = useState("OFF")
  const [owner, setOwner] = useState(false)
  const [notif, setNotif] = useState(null)
  const [pauseLogs, setPauseLogs] = useState(false)
  const [myIp, setMyIp] = useState("")

  /* ===== LOGS ===== */
  const [logs, setLogs] = useState([])
  const logRef = useRef(null)

  /* ===== SYSTEM STATS ===== */
  const [sys, setSys] = useState({
    ping: null,
    cpu: 0,
    ram: 0,
    totalRam: 0,
    disk: 0,
    botUptime: 0,
    vpsUptime: 0
  })

  const cpuHist = useRef(Array(32).fill(0))
  const ramHist = useRef(Array(32).fill(0))

  /* ===== TOAST ===== */
  const toast = (msg, type = "ok") => {
    setNotif({ msg, type })
    setTimeout(() => setNotif(null), 3000)
  }

  /* ===== FETCH LOOP ===== */
  const refresh = async () => {
    if (pauseLogs) return
    try {
      /* STATUS */
      const s = await fetch("/dashboard/api/status").then(r => r.json())
      setStatus(s.status)

      /* LOGS (OWNER CHECK) */
      const l = await fetch("/dashboard/api/logs")
      if (l.ok) {
        setOwner(true)
        setLogs((await l.json()).logs || [])
      } else {
        setOwner(false)
      }

      /* SYSTEM (PUBLIC SAFE) */
      const sysRes = await fetch("/dashboard/api/system")
      if (sysRes.ok) {
        const d = await sysRes.json()
        setSys(d)

        cpuHist.current.push(d.cpu || 0)
        cpuHist.current.shift()

        ramHist.current.push(
          d.totalRam ? Math.round((d.ram / d.totalRam) * 100) : 0
        )
        ramHist.current.shift()
      }
    } catch {}
  }

  useEffect(() => {
    refresh()
    const i = setInterval(refresh, 2000)
    return () => clearInterval(i)
  }, [pauseLogs])

  /* ===== AUTO SCROLL LOG ===== */
  useEffect(() => {
    if (logRef.current)
      logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs])

  /* ===== SHOW IP (PUBLIC) ===== */
  const showIp = async () => {
    try {
      const r = await fetch("/dashboard/api/my-ip")
      const d = await r.json()
      setMyIp(d.ip)
      toast(`Your IP: ${d.ip}`)
    } catch {
      toast("Failed get IP", "err")
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
        <div className="wrap">

          {/* HEADER */}
          <header className="header">
            <div>
              <h1>Dashboard</h1>
              <small>Realtime Bot Monitoring</small>
            </div>
            <div className={`status ${status}`}>
              <span /> {status}
            </div>
          </header>

          {/* STATS */}
          <section className="grid stats">
            <Stat title="Ping" value={sys.ping != null ? `${sys.ping} ms` : "—"} />
            <Stat title="Bot Uptime" value={`${Math.floor(sys.botUptime / 60)} min`} />
            <Stat title="VPS Uptime" value={`${Math.floor(sys.vpsUptime / 3600)} h`} />
            <Stat title="Disk" value={`${sys.disk || 0} GB`} />
          </section>

          {/* CHARTS */}
          <section className="grid charts">
            <Chart title="CPU Usage" data={cpuHist.current} />
            <Chart title="RAM Usage" data={ramHist.current} />
          </section>

          {/* CONTROL */}
          <section className="panel glass">
            <h3>Bot Control</h3>
            <div className="actions">
              {owner && (
                <>
                  <button className="rgb">START</button>
                  <button className="rgb danger">STOP</button>
                </>
              )}
              <button className="ghost" onClick={showIp}>Show IP</button>
            </div>
            {myIp && <small className="ip">Your IP: {myIp}</small>}
          </section>

          {/* LOGS (OWNER ONLY) */}
          {owner && (
            <section className="panel glass">
              <div className="logTop">
                <h3>Realtime Logs</h3>
                <button className="ghost" onClick={() => setPauseLogs(!pauseLogs)}>
                  {pauseLogs ? "Resume" : "Pause"}
                </button>
              </div>

              <div className="logbox" ref={logRef}>
                {logs.length === 0 && <div className="log muted">No logs</div>}
                {logs.map((l, i) => (
                  <div key={i} className={`log ${/err|fail/i.test(l)?"err":"ok"}`}>
                    {l}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {notif && <div className={`toast ${notif.type}`}>{notif.msg}</div>}

      {/* STYLE */}
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
          backdrop-filter:blur(26px);
          border:1px solid rgba(255,255,255,.15);
          box-shadow:0 30px 80px rgba(0,0,0,.7);
        }

        .sidebar{
          width:240px;
          padding:28px;
        }

        .sidebar button{
          width:100%;
          padding:14px;
          margin-bottom:12px;
          border-radius:14px;
          background:transparent;
          border:1px solid rgba(255,255,255,.2);
          color:white;
          text-align:left;
        }

        .sidebar .active{
          background:linear-gradient(90deg,#7f5cff55,transparent);
        }

        .main{flex:1;padding:40px}
        .wrap{max-width:1200px;margin:auto}

        .header{
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
          margin-bottom:28px;
        }

        .status{
          display:flex;
          align-items:center;
          gap:8px;
          font-weight:700;
        }

        .status span{
          width:10px;height:10px;border-radius:50%;
          background:${status==="ON"?"#22c55e":"#ef4444"};
          box-shadow:0 0 14px currentColor;
          animation:pulse 1.5s infinite;
        }

        .grid{
          display:grid;
          gap:18px;
          margin-bottom:26px;
        }

        .stats{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
        .charts{grid-template-columns:repeat(auto-fit,minmax(360px,1fr))}

        .card{
          padding:28px;
          border-radius:24px;
          min-height:120px;
        }

        .panel{
          padding:26px;
          border-radius:26px;
          margin-bottom:26px;
        }

        .actions{
          display:flex;
          gap:14px;
          flex-wrap:wrap;
          margin-top:14px;
        }

        .rgb{
          padding:14px 26px;
          border-radius:18px;
          border:2px solid transparent;
          background:
            linear-gradient(#020617,#020617) padding-box,
            linear-gradient(120deg,#00fff0,#7f5cff,#ff4ecd,#22c55e,#00fff0) border-box;
          background-size:300%;
          animation:rgb 6s linear infinite,hue 8s linear infinite;
        }

        .danger{filter:hue-rotate(160deg)}

        .ghost{
          padding:14px 22px;
          border-radius:16px;
          background:transparent;
          border:1px solid rgba(255,255,255,.25);
        }

        .chart{
          height:160px;
          display:flex;
          align-items:flex-end;
          gap:4px;
        }

        .chart div{
          flex:1;
          border-radius:6px 6px 0 0;
          background:linear-gradient(180deg,#22c55e,#7f5cff);
          animation:grow .3s ease;
        }

        .logbox{
          margin-top:14px;
          max-height:260px;
          overflow:auto;
          background:rgba(0,0,0,.6);
          padding:14px;
          border-radius:16px;
          font-family:monospace;
        }

        .log.ok{color:#4ade80}
        .log.err{color:#f87171}
        .log.muted{color:#9ca3af}

        .toast{
          position:fixed;
          bottom:24px;
          right:24px;
          padding:14px 18px;
          border-radius:16px;
          background:rgba(0,0,0,.75);
        }

        @keyframes rgb{to{background-position:300%}}
        @keyframes hue{to{filter:hue-rotate(360deg)}}
        @keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.6)}100%{transform:scale(1)}}
        @keyframes grow{from{height:0}}

        @media(hover:none){
          .layout{flex-direction:column}
          .sidebar{width:100%;display:flex;justify-content:space-around}
          .main{padding:20px}
        }
      `}</style>
    </div>
  )
}

/* ===== SMALL COMPONENTS ===== */
function Stat({ title, value }) {
  return (
    <div className="card glass">
      <h4 style={{color:"#9ca3af"}}>{title}</h4>
      <b style={{fontSize:"26px"}}>{value || "—"}</b>
    </div>
  )
}

function Chart({ title, data }) {
  return (
    <div className="card glass">
      <h4 style={{color:"#9ca3af",marginBottom:10}}>{title}</h4>
      <div className="chart">
        {data.map((v, i) => (
          <div key={i} style={{ height: `${Math.min(v,100)}%` }} />
        ))}
      </div>
    </div>
  )
}
