"use client"
import { useEffect, useRef, useState } from "react"

export default function Dashboard() {
  /* ===== STATE ===== */
  const [status, setStatus] = useState("OFF")
  const [owner, setOwner] = useState(false)
  const [notif, setNotif] = useState(null)
  const [myIp, setMyIp] = useState("")

  const [logs, setLogs] = useState([])
  const logRef = useRef(null)

  const [sys, setSys] = useState({
    ping: null,
    cpu: 0,
    ram: 0,
    totalRam: 0,
    disk: 0,
    botUptime: 0,
    vpsUptime: 0
  })

  const cpuHist = useRef(Array(24).fill(0))
  const ramHist = useRef(Array(24).fill(0))

  /* ===== TOAST ===== */
  const toast = (msg, type="ok") => {
    setNotif({ msg, type })
    setTimeout(()=>setNotif(null),3000)
  }

  /* ===== FETCH LOOP ===== */
  const refresh = async () => {
    try {
      /* STATUS (PUBLIC) */
      const s = await fetch("/api/status").then(r=>r.json())
      setStatus(s.status)

      /* SYSTEM (PUBLIC) */
      const sysRes = await fetch("/api/system")
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

      /* LOGS = OWNER CHECK */
      const l = await fetch("/api/logs")
      if (l.ok) {
        setOwner(true)
        setLogs((await l.json()).logs || [])
      } else {
        setOwner(false)
      }
    } catch {}
  }

  useEffect(()=>{
    refresh()
    const i = setInterval(refresh, 2000)
    return ()=>clearInterval(i)
  },[])

  useEffect(()=>{
    if(logRef.current)
      logRef.current.scrollTop = logRef.current.scrollHeight
  },[logs])

  /* ===== ACTIONS ===== */
  const post = async (url) => {
    try {
      await fetch(url, { method:"POST" })
      toast("Success")
      refresh()
    } catch {
      toast("Failed", "err")
    }
  }

  const showIp = async () => {
    try {
      const r = await fetch("/api/my-ip")
      const d = await r.json()
      setMyIp(d.ip)
      toast(`IP: ${d.ip}`)
    } catch {
      toast("Failed get IP", "err")
    }
  }

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">RafzBot</div>
        <nav>
          <button className="active">Dashboard</button>
          <button disabled>Logs</button>
          <button disabled>Settings</button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="main">

        {/* HEADER */}
        <div className="top">
          <div>
            <h1>Dashboard</h1>
            <p>Realtime Bot Monitoring</p>
          </div>
          <div className={`badge ${status}`}>
            <span/> {status}
          </div>
        </div>

        {/* METRICS (PUBLIC) */}
        <section className="cards">
          <Metric title="Ping" value={sys.ping!=null?`${sys.ping} ms`:"—"} />
          <Metric title="Bot Uptime" value={`${Math.floor(sys.botUptime/60)} min`} />
          <Metric title="VPS Uptime" value={`${Math.floor(sys.vpsUptime/3600)} h`} />
          <Metric title="Disk" value={`${sys.disk||0} GB`} />
        </section>

        {/* CHARTS (PUBLIC) */}
        <section className="charts">
          <Graph title="CPU Usage" data={cpuHist.current} />
          <Graph title="RAM Usage" data={ramHist.current} />
        </section>

        {/* CONTROL (PUBLIC + OWNER) */}
        <section className="panel">
          <h3>Bot Control</h3>
          <div className="actions">
            <button className="btn primary" onClick={()=>post("/api/start")}>
              Start Bot
            </button>

            {owner && (
              <button className="btn danger" onClick={()=>post("/api/stop")}>
                Stop Bot
              </button>
            )}

            <button className="btn ghost" onClick={showIp}>
              Show IP
            </button>
          </div>
          {myIp && <div className="ip">Your IP: {myIp}</div>}
        </section>

        {/* LOGS (OWNER ONLY) */}
        {owner && (
          <section className="panel">
            <h3>Realtime Logs</h3>
            <div className="logs" ref={logRef}>
              {logs.length===0 && <div className="muted">No logs</div>}
              {logs.map((l,i)=>(
                <div key={i} className={/err|fail/i.test(l)?"log err":"log ok"}>
                  {l}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {notif && <div className={`toast ${notif.type}`}>{notif.msg}</div>}

      {/* STYLE */}
      <style jsx>{`
        *{box-sizing:border-box}
        body{margin:0}

        .app{
          display:flex;
          min-height:100vh;
          background:radial-gradient(circle at top,#0b1435,#020617);
          color:#e5e7eb;
          font-family:Inter,system-ui
        }

        .sidebar{
          width:240px;
          padding:28px;
          background:linear-gradient(180deg,#0e1530,#080c1a);
          border-right:1px solid rgba(255,255,255,.06)
        }

        .brand{font-size:22px;font-weight:700;margin-bottom:32px}

        nav button{
          width:100%;
          padding:14px;
          margin-bottom:12px;
          border-radius:14px;
          background:transparent;
          border:1px solid rgba(255,255,255,.1);
          color:white;
          text-align:left;
        }

        nav .active{
          background:linear-gradient(90deg,#7f5cff55,transparent);
        }

        .main{
          flex:1;
          padding:40px;
          max-width:1400px;
          margin:auto;
        }

        .top{
          display:flex;
          justify-content:space-between;
          align-items:flex-end;
          margin-bottom:30px;
        }

        .badge{
          display:flex;
          align-items:center;
          gap:8px;
          font-weight:600;
        }

        .badge span{
          width:10px;height:10px;border-radius:50%;
          background:${status==="ON"?"#22c55e":"#ef4444"};
          box-shadow:0 0 12px currentColor;
        }

        .cards{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
          gap:20px;
          margin-bottom:30px;
        }

        .metric{
          padding:26px;
          border-radius:20px;
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.1);
        }

        .metric h4{margin:0;color:#9ca3af}
        .metric b{font-size:28px}

        .charts{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:24px;
          margin-bottom:30px;
        }

        .graph{
          padding:26px;
          border-radius:22px;
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.1);
        }

        .bars{
          display:flex;
          align-items:flex-end;
          gap:4px;
          height:160px;
        }

        .bars div{
          flex:1;
          border-radius:4px 4px 0 0;
          background:linear-gradient(180deg,#22c55e,#7f5cff);
        }

        .panel{
          padding:28px;
          border-radius:24px;
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.1);
          margin-bottom:30px;
        }

        .actions{
          display:flex;
          gap:14px;
          flex-wrap:wrap;
          margin-top:14px;
        }

        .btn{
          padding:14px 26px;
          border-radius:16px;
          border:none;
          font-weight:600;
        }

        .primary{
          background:linear-gradient(135deg,#7f5cff,#22c55e);
        }

        .danger{
          background:linear-gradient(135deg,#ef4444,#b91c1c);
        }

        .ghost{
          background:transparent;
          border:1px solid rgba(255,255,255,.2);
          color:white;
        }

        .logs{
          margin-top:14px;
          max-height:260px;
          overflow:auto;
          font-family:monospace;
        }

        .log.ok{color:#4ade80}
        .log.err{color:#f87171}
        .muted{color:#9ca3af}

        .toast{
          position:fixed;
          bottom:24px;
          right:24px;
          padding:14px 18px;
          border-radius:14px;
          background:#020617;
          border:1px solid rgba(255,255,255,.1)
        }

        @media(max-width:900px){
          .app{flex-direction:column}
          .sidebar{width:100%;display:flex;gap:12px}
          nav{display:flex;gap:12px}
          .charts{grid-template-columns:1fr}
        }
      `}</style>
    </div>
  )
}

/* COMPONENTS */
function Metric({title,value}){
  return(
    <div className="metric">
      <h4>{title}</h4>
      <b>{value}</b>
    </div>
  )
}

function Graph({title,data}){
  return(
    <div className="graph">
      <h4 style={{color:"#9ca3af",marginBottom:12}}>{title}</h4>
      <div className="bars">
        {data.map((v,i)=>(
          <div key={i} style={{height:`${Math.min(v,100)}%`}}/>
        ))}
      </div>
    </div>
  )
}
