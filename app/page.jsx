"use client"
import { useEffect, useRef, useState } from "react"

export default function Dashboard() {
  const [status, setStatus] = useState("OFF")
  const [uptime, setUptime] = useState(0)
  const [logs, setLogs] = useState([])
  const [owner, setOwner] = useState(false)
  const [notif, setNotif] = useState(null)
  const [pauseLogs, setPauseLogs] = useState(false)
  const [myIp, setMyIp] = useState("")

  const [sys, setSys] = useState({
    ping: 0,
    cpu: 0,
    ram: 0,
    totalRam: 0,
    disk: 0,
    botUptime: 0,
    vpsUptime: 0
  })

  const cpuHist = useRef(Array(32).fill(0))
  const ramHist = useRef(Array(32).fill(0))
  const uptimeRef = useRef(null)
  const logRef = useRef(null)

  /* ===== TOAST ===== */
  const toast = (msg, type = "ok") => {
    setNotif({ msg, type })
    setTimeout(() => setNotif(null), 3000)
  }

  /* ===== FETCH ===== */
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

      const sysRes = await fetch("/dashboard/api/system")
      if (sysRes.ok) {
        const d = await sysRes.json()
        setSys(d)

        cpuHist.current.push(d.cpu)
        cpuHist.current.shift()

        ramHist.current.push(d.ram)
        ramHist.current.shift()
      }
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

  /* ===== SHOW IP ===== */
  const showIp = async () => {
    try {
      const r = await fetch("/dashboard/api/my-ip")
      const d = await r.json()
      setMyIp(d.ip)
      toast(`IP: ${d.ip}`)
    } catch {
      toast("Failed get IP", "err")
    }
  }

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar glass">
        <h2>RafzBot</h2>
        <nav>
          <button className="active">Dashboard</button>
          <button disabled>Logs</button>
          <button disabled>Settings</button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="main">
        <div className="container">

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

          {/* STAT CARDS */}
          <section className="grid stats">
            <Card title="Ping" value={`${sys.ping} ms`} />
            <Card title="Bot Uptime" value={`${Math.floor(sys.botUptime / 60)} min`} />
            <Card title="VPS Uptime" value={`${Math.floor(sys.vpsUptime / 3600)} h`} />
            <Card title="Disk" value={`${sys.disk} GB`} />
          </section>

          {/* CHARTS */}
          <section className="grid charts">
            <Chart title="CPU Usage (%)" data={cpuHist.current} />
            <Chart title="RAM Usage (MB)" data={ramHist.current} />
          </section>

          {/* CONTROL */}
          <section className="panel glass">
            <h3>Bot Control</h3>
            <div className="actions">
              <button className="rgb">START</button>
              <button className="rgb danger">STOP</button>
              <button className="ghost" onClick={showIp}>Show IP</button>
            </div>
            {myIp && <small className="ip">Your IP: {myIp}</small>}
          </section>

          {/* LOGS */}
          {owner && (
            <section className="panel glass">
              <div className="logTop">
                <h3>Realtime Logs</h3>
                <div>
                  <button className="ghost" onClick={() => setPauseLogs(!pauseLogs)}>
                    {pauseLogs ? "Resume" : "Pause"}
                  </button>
                </div>
              </div>

              <div className="logbox" ref={logRef}>
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

      <style jsx>{`
        *{box-sizing:border-box}
        body{margin:0}

        .layout{
          min-height:100vh;
          display:flex;
          background:radial-gradient(circle at top,#0b1435,#020617);
          color:#e5e7eb;
        }

        .glass{
          background:rgba(20,25,50,.65);
          backdrop-filter:blur(26px);
          border:1px solid rgba(255,255,255,.14);
          box-shadow:0 30px 80px rgba(0,0,0,.7);
        }

        /* SIDEBAR */
        .sidebar{
          width:240px;
          padding:28px;
        }
        .sidebar h2{margin-bottom:30px}
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

        /* MAIN */
        .main{flex:1;padding:40px}
        .container{max-width:1200px;margin:auto}

        .header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:28px;
        }

        .status span{
          width:10px;height:10px;border-radius:50%;
          background:${status==="ON"?"#22c55e":"#ef4444"};
          box-shadow:0 0 14px currentColor;
          animation:pulse 1.5s infinite;
        }

        /* GRID */
        .grid{
          display:grid;
          gap:18px;
          margin-bottom:26px;
        }
        .stats{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
        .charts{grid-template-columns:repeat(auto-fit,minmax(360px,1fr))}

        /* CARD */
        .card{
          padding:22px;
          border-radius:22px;
        }
        .card h4{margin:0 0 6px 0;color:#9ca3af}
        .card b{font-size:26px}

        /* CHART */
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

        /* PANEL */
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

        /* LOG */
        .logTop{display:flex;justify-content:space-between;align-items:center}
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

        @media(max-width:900px){
          .layout{flex-direction:column}
          .sidebar{width:100%;display:flex;justify-content:space-around}
          .main{padding:20px}
        }
      `}</style>
    </div>
  )
}

/* COMPONENTS */
function Card({ title, value }) {
  return (
    <div className="card glass">
      <h4>{title}</h4>
      <b>{value}</b>
    </div>
  )
}

function Chart({ title, data }) {
  return (
    <div className="card glass">
      <h4>{title}</h4>
      <div className="chart">
        {data.map((v, i) => (
          <div key={i} style={{ height: `${Math.min(v,100)}%` }} />
        ))}
      </div>
    </div>
  )
}
