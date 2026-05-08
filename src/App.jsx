import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Nunito:wght@300;400;500;600;700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Nunito',sans-serif; background:#050D1A; color:#E2E8F0; }
  ::-webkit-scrollbar { width:6px; }
  ::-webkit-scrollbar-track { background:#0A1628; }
  ::-webkit-scrollbar-thumb { background:linear-gradient(#7C3AED,#06B6D4); border-radius:3px; }

  @keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-20px)} }
  @keyframes pulse-glow { 0%,100%{box-shadow:0 0 20px rgba(124,58,237,0.3)} 50%{box-shadow:0 0 40px rgba(124,58,237,0.7),0 0 80px rgba(6,182,212,0.3)} }
  @keyframes slide-in-left { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slide-in-up { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes rotate-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes blob { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
  @keyframes counter { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes glow-pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
  @keyframes marquee { 0%{transform:translateX(100%)} 100%{transform:translateX(-100%)} }
  @keyframes robot-bounce { 0%,100%{transform:translateY(0) rotate(0deg)} 25%{transform:translateY(-6px) rotate(-3deg)} 75%{transform:translateY(-3px) rotate(3deg)} }
  @keyframes ring-pulse { 0%{transform:scale(1);opacity:1} 100%{transform:scale(2.2);opacity:0} }
  @keyframes slide-in-right { from{opacity:0;transform:translateX(40px) scale(0.95)} to{opacity:1;transform:translateX(0) scale(1)} }
  @keyframes top-bar-glow { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes eye-blink { 0%,90%,100%{transform:scaleY(1)} 95%{transform:scaleY(0.1)} }
  @keyframes typing { 0%,60%{opacity:1} 80%,100%{opacity:0} }

  .sb-glass { background:rgba(255,255,255,0.04); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.08); }
  .sb-glass-strong { background:rgba(255,255,255,0.07); backdrop-filter:blur(30px); border:1px solid rgba(255,255,255,0.12); }
  .sb-btn-primary { background:linear-gradient(135deg,#7C3AED,#06B6D4); color:#fff; border:none; cursor:pointer; font-family:'Nunito',sans-serif; font-weight:700; border-radius:12px; transition:all 0.3s; position:relative; overflow:hidden; }
  .sb-btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(124,58,237,0.5); }
  .sb-btn-outline { background:transparent; color:#E2E8F0; border:1px solid rgba(255,255,255,0.2); cursor:pointer; font-family:'Nunito',sans-serif; font-weight:600; border-radius:12px; transition:all 0.3s; }
  .sb-btn-outline:hover { background:rgba(255,255,255,0.08); border-color:rgba(124,58,237,0.6); transform:translateY(-2px); }
  .sb-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:20px; transition:all 0.3s; }
  .sb-card:hover { background:rgba(255,255,255,0.07); border-color:rgba(124,58,237,0.4); transform:translateY(-4px); box-shadow:0 20px 40px rgba(0,0,0,0.4); }
  .sb-gradient-text { background:linear-gradient(135deg,#A78BFA,#38BDF8,#22D3EE); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .sb-section { padding:80px 0; }
  .sb-container { max-width:1200px; margin:0 auto; padding:0 24px; }
  .sb-nav-link { color:#94A3B8; text-decoration:none; font-weight:500; font-size:14px; transition:color 0.2s; cursor:pointer; padding:8px 12px; border-radius:8px; }
  .sb-nav-link:hover { color:#E2E8F0; background:rgba(255,255,255,0.06); }
  .sb-tag { display:inline-block; padding:4px 12px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; }
  .feature-icon { width:52px; height:52px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:24px; margin-bottom:16px; }
  .star { color:#F59E0B; }
  .progress-bar { height:6px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden; }
  .progress-fill { height:100%; border-radius:3px; background:linear-gradient(90deg,#7C3AED,#06B6D4); transition:width 1.5s ease; }
  .blob-1 { position:absolute; width:500px; height:500px; background:radial-gradient(circle,rgba(124,58,237,0.15),transparent 70%); border-radius:50%; animation:blob 8s infinite; top:-100px; left:-100px; pointer-events:none; }
  .blob-2 { position:absolute; width:400px; height:400px; background:radial-gradient(circle,rgba(6,182,212,0.12),transparent 70%); border-radius:50%; animation:blob 10s infinite reverse; bottom:-50px; right:-50px; pointer-events:none; }
  .grid-dots { position:absolute; inset:0; background-image:radial-gradient(rgba(255,255,255,0.06) 1px,transparent 1px); background-size:32px 32px; pointer-events:none; }
  .testimonial-card { flex:0 0 340px; }
  .animate-float { animation:float 4s ease-in-out infinite; }
  .animate-float-delay { animation:float 4s ease-in-out 1s infinite; }
  .stat-glow { box-shadow:0 0 30px rgba(124,58,237,0.2); }
  input, textarea { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:12px; color:#E2E8F0; font-family:'Nunito',sans-serif; padding:12px 16px; width:100%; font-size:14px; transition:border-color 0.3s; outline:none; }
  input:focus, textarea:focus { border-color:rgba(124,58,237,0.6); box-shadow:0 0 0 3px rgba(124,58,237,0.1); }
  input::placeholder, textarea::placeholder { color:#475569; }
  select { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:10px; color:#E2E8F0; font-family:'Nunito',sans-serif; padding:10px 14px; font-size:14px; outline:none; cursor:pointer; }
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.8); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; z-index:1000; }
  .badge-new { background:linear-gradient(135deg,#7C3AED,#06B6D4); color:#fff; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; }
  @media(max-width:768px) {
    .sb-section { padding:50px 0; }
    .hero-btns { flex-direction:column; }
    .grid-3 { grid-template-columns:1fr !important; }
    .grid-4 { grid-template-columns:1fr 1fr !important; }
    .nav-links-desktop { display:none !important; }
    .hero-title { font-size:36px !important; }
    .dash-grid { grid-template-columns:1fr !important; }
  }
`;

const profiles = [
  { name:"Kavindi Perera", skill:"Graphic Design", district:"Colombo", rating:4.9, jobs:47, bio:"UI/UX designer & brand identity specialist with 3 years experience", color:"#7C3AED", emoji:"🎨" },
  { name:"Ravindu Silva", skill:"Web Development", district:"Kandy", rating:4.8, jobs:62, bio:"Full-stack developer specializing in React & Node.js applications", color:"#06B6D4", emoji:"💻" },
  { name:"Nimesha Fernando", skill:"Video Editing", district:"Galle", rating:4.7, jobs:38, bio:"Creative video editor for social media, ads & corporate content", color:"#EC4899", emoji:"🎬" },
  { name:"Chamara Wijesinghe", skill:"Electrical Repair", district:"Matara", rating:4.9, jobs:91, bio:"Certified electrician — home wiring, panels, solar installation", color:"#F59E0B", emoji:"⚡" },
  { name:"Dinusha Jayawardena", skill:"Photography", district:"Colombo", rating:4.8, jobs:55, bio:"Event & product photographer with professional editing skills", color:"#10B981", emoji:"📸" },
  { name:"Ashen Ranasinghe", skill:"Solar Installation", district:"Kurunegala", rating:4.7, jobs:29, bio:"Renewable energy technician — residential & commercial solar", color:"#F97316", emoji:"☀️" },
];

const jobs = [
  { title:"Logo Design for Tea Brand", type:"Design", budget:"Rs 8,000", district:"Colombo", posted:"2h ago", urgent:true },
  { title:"WordPress Website Development", type:"Web Dev", budget:"Rs 25,000", district:"Kandy", posted:"5h ago", urgent:false },
  { title:"Home Electrical Rewiring", type:"Electrical", budget:"Rs 15,000", district:"Galle", posted:"1d ago", urgent:true },
  { title:"Wedding Photography (2 days)", type:"Photography", budget:"Rs 35,000", district:"Matara", posted:"3h ago", urgent:false },
  { title:"Social Media Video (30s Reel)", type:"Video", budget:"Rs 6,500", district:"Colombo", posted:"6h ago", urgent:false },
  { title:"Solar Panel Installation (3kW)", type:"Solar", budget:"Rs 120,000", district:"Kurunegala", posted:"2d ago", urgent:false },
];

const courses = [
  { title:"Full Stack Web Development", category:"ICT", lessons:48, students:1240, progress:72, color:"#7C3AED", icon:"💻", level:"Intermediate" },
  { title:"AI & Machine Learning Basics", category:"AI/ML", lessons:32, students:890, progress:45, color:"#06B6D4", icon:"🤖", level:"Beginner" },
  { title:"Solar Energy Technology", category:"Renewable", lessons:24, students:567, progress:90, color:"#F59E0B", icon:"☀️", level:"All Levels" },
  { title:"Electrical Technology Cert.", category:"Electrical", lessons:36, students:743, progress:30, color:"#EC4899", icon:"⚡", level:"Beginner" },
  { title:"Digital Entrepreneurship", category:"Business", lessons:20, students:1560, progress:60, color:"#10B981", icon:"🚀", level:"All Levels" },
  { title:"Network & Cybersecurity", category:"Networking", lessons:40, students:432, progress:15, color:"#F97316", icon:"🔒", level:"Advanced" },
];

const earningsData = [
  {m:"Jan",e:18000},{m:"Feb",e:22000},{m:"Mar",e:19000},{m:"Apr",e:31000},{m:"May",e:28000},{m:"Jun",e:38000},{m:"Jul",e:42000},
];

const skillPieData = [
  {name:"Web Dev",value:35,color:"#7C3AED"},{name:"Design",value:25,color:"#06B6D4"},{name:"Electrical",value:20,color:"#F59E0B"},{name:"Other",value:20,color:"#10B981"},
];

const testimonials = [
  { name:"Sithara Wickramasinghe", district:"Colombo", text:"SkillBridge completely changed my life. I was a struggling design student and now I earn Rs 60,000/month from freelancing. This platform is a blessing for Sri Lankan youth!", skill:"Graphic Designer", rating:5 },
  { name:"Isuru Madushanka", district:"Kandy", text:"I got my first web development client within a week of joining. The verification system makes clients trust me immediately. Highly recommend to all IT students!", skill:"Web Developer", rating:5 },
  { name:"Thilini Bandara", district:"Galle", text:"As a girl from a rural area, I never thought I could earn independently. SkillBridge gave me a platform and now I tutor 20+ students online!", skill:"Mathematics Tutor", rating:5 },
];

const features = [
  { title:"Skill Marketplace", desc:"Showcase and monetize your skills nationwide", icon:"🛒", color:"#7C3AED" },
  { title:"Student Freelancing", desc:"Start earning while still in school or training", icon:"🎓", color:"#06B6D4" },
  { title:"Technical Services", desc:"Offer vocational and technical services locally", icon:"🔧", color:"#F59E0B" },
  { title:"Career Growth", desc:"Build your portfolio and professional reputation", icon:"📈", color:"#10B981" },
  { title:"Online Learning", desc:"Access free courses and earn certifications", icon:"📚", color:"#EC4899" },
  { title:"Community Ratings", desc:"Build trust with verified reviews and ratings", icon:"⭐", color:"#F97316" },
  { title:"District Opportunities", desc:"Find work close to home across all districts", icon:"📍", color:"#8B5CF6" },
  { title:"Verified Profiles", desc:"Get certified and stand out to employers", icon:"✅", color:"#14B8A6" },
];

function useCounter(end, duration=2000, started=false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start=0; const step = end/60; const timer = setInterval(()=>{ start+=step; if(start>=end){setCount(end);clearInterval(timer);}else{setCount(Math.floor(start));} }, duration/60);
    return ()=>clearInterval(timer);
  }, [started, end, duration]);
  return count;
}

function Stars({n=5}) { return <span>{Array(n).fill(0).map((_,i)=><span key={i} className="star">★</span>)}</span>; }

function TopBanner() {
  const ticker = "✦ Built by Hashan Munasinghe  ✦  SkillBridge Sri Lanka  ✦  Empowering Youth Since 2024  ✦  UN SDG 8 Champion  ✦  Hashan Munasinghe — Designer & Developer  ✦  Full Stack Engineer  ✦  Sri Lanka 🇱🇰  ✦  Open to Collaborate  ✦  hashan@skillbridge.lk  ✦ ";
  return (
    <div style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,height:"38px",overflow:"hidden",background:"linear-gradient(90deg,#1a0533,#0f1f45,#0a2a1a,#1a0533,#0f1f45)",backgroundSize:"300% 100%",animation:"top-bar-glow 6s ease infinite",borderBottom:"1px solid rgba(167,139,250,0.25)"}}>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent 0%,rgba(124,58,237,0.08) 30%,rgba(6,182,212,0.08) 70%,transparent 100%)",pointerEvents:"none"}}/>
      <div style={{display:"flex",alignItems:"center",height:"100%",overflow:"hidden",whiteSpace:"nowrap"}}>
        <div style={{display:"inline-flex",animation:"ticker 28s linear infinite",gap:0}}>
          {[ticker, ticker].map((t,i)=>(
            <span key={i} style={{display:"inline-flex",alignItems:"center",gap:"6px",fontSize:"11.5px",fontWeight:700,letterSpacing:"0.6px",paddingRight:"0",color:"transparent",background:"linear-gradient(90deg,#A78BFA,#38BDF8,#34D399,#F59E0B,#A78BFA)",WebkitBackgroundClip:"text",backgroundClip:"text",backgroundSize:"200% 100%",animation:"top-bar-glow 4s ease infinite"}}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:"80px",background:"linear-gradient(90deg,#0f0520,transparent)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",right:0,top:0,bottom:0,width:"80px",background:"linear-gradient(270deg,#0f0520,transparent)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",left:"50%",top:0,transform:"translateX(-50%)",display:"flex",alignItems:"center",height:"100%",gap:"8px",pointerEvents:"none"}}>
        <span style={{fontSize:"10px",background:"rgba(167,139,250,0.2)",border:"1px solid rgba(167,139,250,0.4)",borderRadius:"4px",padding:"1px 7px",color:"#C4B5FD",fontWeight:800,letterSpacing:"1px",textTransform:"uppercase"}}>BUILDER</span>
        <span style={{fontSize:"12px",fontWeight:800,background:"linear-gradient(90deg,#A78BFA,#38BDF8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"0.5px"}}>Hashan Munasinghe</span>
        <span style={{fontSize:"10px",background:"rgba(6,182,212,0.2)",border:"1px solid rgba(6,182,212,0.4)",borderRadius:"4px",padding:"1px 7px",color:"#67E8F9",fontWeight:700}}>SDG 8</span>
      </div>
    </div>
  );
}

function ContactRobot() {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState([{from:"bot",text:"Hi! 👋 I'm Hashan's AI assistant. Want to connect with the SkillBridge creator?"}]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const replies = ["Great question! Hashan built SkillBridge to empower Sri Lankan youth 🇱🇰","You can reach Hashan at hashan@skillbridge.lk 📧","Hashan is a full-stack developer passionate about social impact 🚀","Feel free to connect on LinkedIn: linkedin.com/in/hashanmunasinghe 💼","SkillBridge supports UN SDG 8 — decent work for everyone! 🌱"];
  const send = () => {
    if(!input.trim()) return;
    const userMsg = input; setInput("");
    setChat(c=>[...c,{from:"user",text:userMsg}]); setTyping(true);
    setTimeout(()=>{ setTyping(false); setChat(c=>[...c,{from:"bot",text:replies[Math.floor(Math.random()*replies.length)]}]); },1200);
  };
  return (
    <div style={{position:"fixed",bottom:"28px",right:"28px",zIndex:999,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"12px"}}>
      {open && (
        <div style={{width:"320px",borderRadius:"22px",overflow:"hidden",border:"1px solid rgba(124,58,237,0.35)",boxShadow:"0 24px 60px rgba(0,0,0,0.6),0 0 40px rgba(124,58,237,0.2)",animation:"slide-in-right 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",background:"#0D1628"}}>
          <div style={{background:"linear-gradient(135deg,#1a0a3d,#0a2040)",padding:"18px 20px",borderBottom:"1px solid rgba(124,58,237,0.25)",display:"flex",alignItems:"center",gap:"12px"}}>
            <div style={{position:"relative"}}>
              <div style={{width:"44px",height:"44px",borderRadius:"50%",background:"linear-gradient(135deg,#7C3AED,#06B6D4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",animation:"robot-bounce 3s ease-in-out infinite"}}>🤖</div>
              <div style={{position:"absolute",bottom:1,right:1,width:"11px",height:"11px",borderRadius:"50%",background:"#10B981",border:"2px solid #0D1628"}}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"14px",color:"#E2E8F0"}}>Hashan Munasinghe</div>
              <div style={{fontSize:"11px",color:"#34D399",fontWeight:600}}>● Online · Builder & Developer</div>
            </div>
            <button onClick={()=>setOpen(false)} style={{background:"rgba(255,255,255,0.08)",border:"none",color:"#94A3B8",width:"28px",height:"28px",borderRadius:"8px",cursor:"pointer",fontSize:"14px"}}>✕</button>
          </div>
          <div style={{padding:"16px",background:"linear-gradient(180deg,#0a1628,#050d1a)",height:"210px",overflowY:"auto",display:"flex",flexDirection:"column",gap:"10px"}}>
            {chat.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.from==="user"?"flex-end":"flex-start"}}>
                {m.from==="bot" && <div style={{width:"26px",height:"26px",borderRadius:"50%",background:"linear-gradient(135deg,#7C3AED,#06B6D4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",marginRight:"8px",flexShrink:0,alignSelf:"flex-end"}}>🤖</div>}
                <div style={{maxWidth:"75%",padding:"9px 13px",borderRadius:m.from==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.from==="user"?"linear-gradient(135deg,#7C3AED,#5B21B6)":"rgba(255,255,255,0.07)",border:`1px solid ${m.from==="user"?"rgba(124,58,237,0.4)":"rgba(255,255,255,0.08)"}`,fontSize:"13px",lineHeight:1.5,color:"#E2E8F0"}}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                <div style={{width:"26px",height:"26px",borderRadius:"50%",background:"linear-gradient(135deg,#7C3AED,#06B6D4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px"}}>🤖</div>
                <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"14px 14px 14px 4px",padding:"10px 14px",display:"flex",gap:"5px",alignItems:"center"}}>
                  {[0,1,2].map(d=><span key={d} style={{width:"6px",height:"6px",borderRadius:"50%",background:"#7C3AED",animation:`typing 1.2s ${d*0.2}s ease-in-out infinite`}}/>)}
                </div>
              </div>
            )}
          </div>
          <div style={{padding:"12px 16px",background:"#0a1628",borderTop:"1px solid rgba(255,255,255,0.07)",display:"flex",gap:"8px"}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Message Hashan..." style={{flex:1,padding:"9px 13px",fontSize:"13px",borderRadius:"10px"}}/>
            <button className="sb-btn-primary" style={{padding:"9px 14px",fontSize:"14px",borderRadius:"10px"}} onClick={send}>➤</button>
          </div>
          <div style={{padding:"10px 16px 14px",background:"#0a1628",textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"center",gap:"10px",marginBottom:"6px"}}>
              {[["📧","hashan@skillbridge.lk"],["💼","LinkedIn"],["🌐","skillbridge.lk"]].map(([ic,l],i)=>(
                <span key={i} style={{fontSize:"11px",color:"#64748B",display:"flex",alignItems:"center",gap:"3px",cursor:"pointer"}} onMouseOver={e=>e.currentTarget.style.color="#A78BFA"} onMouseOut={e=>e.currentTarget.style.color="#64748B"}>{ic} {l}</span>
              ))}
            </div>
            <div style={{fontSize:"10px",color:"#334155",letterSpacing:"0.5px"}}>Designed & Developed by <span style={{color:"#7C3AED",fontWeight:700}}>Hashan Munasinghe</span></div>
          </div>
        </div>
      )}
      <div style={{position:"relative",cursor:"pointer"}} onClick={()=>setOpen(!open)}>
        {!open && <>
          <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"2px solid rgba(124,58,237,0.6)",animation:"ring-pulse 2s ease-out infinite"}}/>
          <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"2px solid rgba(6,182,212,0.4)",animation:"ring-pulse 2s 0.6s ease-out infinite"}}/>
        </>}
        <div style={{width:"60px",height:"60px",borderRadius:"50%",background:"linear-gradient(135deg,#7C3AED,#06B6D4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"26px",boxShadow:"0 8px 30px rgba(124,58,237,0.5)",animation:open?"none":"robot-bounce 3s ease-in-out infinite",position:"relative",zIndex:1}}>
          {open ? "✕" : "🤖"}
        </div>
        {!open && <div style={{position:"absolute",top:"-8px",right:"-4px",background:"linear-gradient(135deg,#EF4444,#DC2626)",borderRadius:"12px",padding:"2px 6px",fontSize:"10px",fontWeight:800,color:"#fff",zIndex:2,whiteSpace:"nowrap"}}>Chat</div>}
      </div>
    </div>
  );
}

function Navbar({activePage, setActivePage}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pages = ["Home","Explore Skills","Find Workers","Training","Dashboard","About","Contact"];
  return (
    <nav style={{position:"fixed",top:"38px",left:0,right:0,zIndex:900,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
      <div className="sb-glass" style={{padding:"0"}}>
        <div className="sb-container" style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:"70px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",cursor:"pointer"}} onClick={()=>setActivePage("Home")}>
            <div style={{width:"36px",height:"36px",background:"linear-gradient(135deg,#7C3AED,#06B6D4)",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px"}}>🌉</div>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"16px",letterSpacing:"-0.3px",lineHeight:1}}>SkillBridge</div>
              <div style={{fontSize:"9px",color:"#64748B",letterSpacing:"2px",textTransform:"uppercase"}}>Sri Lanka</div>
            </div>
          </div>
          <div className="nav-links-desktop" style={{display:"flex",alignItems:"center",gap:"2px"}}>
            {pages.map(p=>(
              <span key={p} className="sb-nav-link" onClick={()=>setActivePage(p)} style={{color:activePage===p?"#A78BFA":"#94A3B8",background:activePage===p?"rgba(124,58,237,0.1)":""}}>{p}</span>
            ))}
          </div>
          <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
            <button className="sb-btn-outline" style={{padding:"8px 16px",fontSize:"13px"}}>Login</button>
            <button className="sb-btn-primary" style={{padding:"8px 20px",fontSize:"13px"}}>Register Free</button>
            <button onClick={()=>setMobileOpen(!mobileOpen)} style={{display:"none",background:"none",border:"none",color:"#E2E8F0",fontSize:"22px",cursor:"pointer",padding:"4px"}} className="mobile-menu-btn">☰</button>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="sb-glass" style={{padding:"16px 24px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
          {pages.map(p=>(
            <div key={p} style={{padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,0.06)",cursor:"pointer",color:activePage===p?"#A78BFA":"#94A3B8",fontWeight:500}} onClick={()=>{setActivePage(p);setMobileOpen(false);}}>{p}</div>
          ))}
        </div>
      )}
    </nav>
  );
}

function HeroSection({setActivePage}) {
  return (
    <section style={{minHeight:"100vh",display:"flex",alignItems:"center",position:"relative",overflow:"hidden",paddingTop:"108px"}}>
      <div className="blob-1"></div>
      <div className="blob-2"></div>
      <div className="grid-dots"></div>
      <div style={{position:"absolute",top:"20%",right:"5%",width:"300px",height:"300px",background:"linear-gradient(135deg,rgba(124,58,237,0.15),rgba(6,182,212,0.1))",borderRadius:"50%",filter:"blur(60px)",animation:"glow-pulse 4s infinite"}}></div>
      <div className="sb-container" style={{textAlign:"center",position:"relative",zIndex:1,padding:"60px 24px"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:"8px",background:"rgba(124,58,237,0.15)",border:"1px solid rgba(124,58,237,0.3)",borderRadius:"30px",padding:"6px 16px",marginBottom:"28px",fontSize:"13px",color:"#A78BFA",fontWeight:600}}>
          <span>🇱🇰</span> Supporting UN SDG 8 — Decent Work & Economic Growth
        </div>
        <div style={{marginBottom:"10px",fontSize:"13px",color:"#64748B",letterSpacing:"3px",textTransform:"uppercase",fontWeight:600}}>Builder: Hashan Munasinghe</div>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(36px,6vw,72px)",lineHeight:1.1,marginBottom:"24px",animation:"slide-in-up 0.8s ease forwards"}} className="hero-title">
          Empowering<br/><span className="sb-gradient-text">Sri Lankan Youth</span><br/>Through Skills
        </h1>
        <p style={{fontSize:"clamp(16px,2vw,20px)",color:"#94A3B8",maxWidth:"600px",margin:"0 auto 40px",lineHeight:1.7,animation:"slide-in-up 0.8s 0.2s ease both"}}>
          Connect with thousands of job opportunities, showcase your talents, and build a thriving career — from school students to skilled craftsmen across all 25 districts.
        </p>
        <div style={{display:"flex",justifyContent:"center",gap:"16px",flexWrap:"wrap",marginBottom:"60px",animation:"slide-in-up 0.8s 0.4s ease both"}} className="hero-btns">
          <button className="sb-btn-primary" style={{padding:"14px 32px",fontSize:"16px"}} onClick={()=>setActivePage("Find Workers")}>🔍 Find Jobs</button>
          <button className="sb-btn-primary" style={{padding:"14px 32px",fontSize:"16px",background:"linear-gradient(135deg,#06B6D4,#10B981)"}} onClick={()=>setActivePage("Explore Skills")}>💡 Offer Skills</button>
          <button className="sb-btn-outline" style={{padding:"14px 32px",fontSize:"16px"}} onClick={()=>setActivePage("About")}>👥 Join Community</button>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:"40px",flexWrap:"wrap",animation:"slide-in-up 0.8s 0.6s ease both"}}>
          {[["12,400+","Students"],["8,200+","Jobs Done"],["350+","Skills"],["25","Districts"]].map(([n,l])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"28px",background:"linear-gradient(135deg,#A78BFA,#38BDF8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{n}</div>
              <div style={{fontSize:"13px",color:"#64748B",marginTop:"2px"}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:"70px",display:"flex",justifyContent:"center",gap:"16px",flexWrap:"wrap"}}>
          {profiles.slice(0,4).map((p,i)=>(
            <div key={i} className="animate-float" style={{animationDelay:`${i*0.3}s`,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"16px",padding:"12px 16px",display:"flex",alignItems:"center",gap:"10px"}}>
              <div style={{width:"38px",height:"38px",borderRadius:"50%",background:`linear-gradient(135deg,${p.color},${p.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px"}}>{p.emoji}</div>
              <div>
                <div style={{fontSize:"13px",fontWeight:700}}>{p.name}</div>
                <div style={{fontSize:"11px",color:"#64748B"}}>{p.skill} · {p.district}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="sb-section" style={{background:"linear-gradient(180deg,transparent,rgba(124,58,237,0.04),transparent)"}}>
      <div className="sb-container">
        <div style={{textAlign:"center",marginBottom:"56px"}}>
          <div className="sb-tag" style={{background:"rgba(6,182,212,0.15)",color:"#22D3EE",border:"1px solid rgba(6,182,212,0.3)",marginBottom:"16px"}}>Platform Features</div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(28px,4vw,44px)",marginBottom:"16px"}}>Everything You Need to <span className="sb-gradient-text">Succeed</span></h2>
          <p style={{color:"#64748B",fontSize:"16px",maxWidth:"500px",margin:"0 auto"}}>A complete ecosystem for skills, learning, and employment across Sri Lanka</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"20px"}} className="grid-4">
          {features.map((f,i)=>(
            <div key={i} className="sb-card" style={{padding:"28px 24px"}}>
              <div className="feature-icon" style={{background:`${f.color}22`,border:`1px solid ${f.color}44`}}><span style={{fontSize:"22px"}}>{f.icon}</span></div>
              <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"17px",marginBottom:"8px"}}>{f.title}</h3>
              <p style={{color:"#64748B",fontSize:"14px",lineHeight:1.6}}>{f.desc}</p>
              <div style={{marginTop:"16px",display:"flex",alignItems:"center",gap:"6px",color:f.color,fontSize:"13px",fontWeight:600,cursor:"pointer"}}>Learn more <span>→</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProfilesSection() {
  return (
    <section className="sb-section">
      <div className="sb-container">
        <div style={{textAlign:"center",marginBottom:"56px"}}>
          <div className="sb-tag" style={{background:"rgba(124,58,237,0.15)",color:"#A78BFA",border:"1px solid rgba(124,58,237,0.3)",marginBottom:"16px"}}>Talented Youth</div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(28px,4vw,44px)",marginBottom:"16px"}}>Meet Our <span className="sb-gradient-text">Skilled Workers</span></h2>
          <p style={{color:"#64748B",fontSize:"16px"}}>Verified professionals ready to help you</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"24px"}}>
          {profiles.map((p,i)=>(
            <div key={i} className="sb-card" style={{padding:"28px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,right:0,width:"120px",height:"120px",background:`radial-gradient(circle at top right,${p.color}22,transparent 70%)`,pointerEvents:"none"}}></div>
              <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"16px"}}>
                <div style={{width:"60px",height:"60px",borderRadius:"16px",background:`linear-gradient(135deg,${p.color},${p.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"28px",flexShrink:0}}>{p.emoji}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:"16px",fontFamily:"'Syne',sans-serif"}}>{p.name}</div>
                  <div style={{fontSize:"12px",color:"#64748B",marginTop:"2px"}}>📍 {p.district}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:"8px",marginBottom:"12px",flexWrap:"wrap"}}>
                <span className="sb-tag" style={{background:`${p.color}22`,color:p.color,border:`1px solid ${p.color}44`}}>{p.skill}</span>
                <span className="sb-tag" style={{background:"rgba(245,158,11,0.15)",color:"#F59E0B",border:"1px solid rgba(245,158,11,0.3)"}}><Stars n={1}/> {p.rating}</span>
              </div>
              <p style={{fontSize:"13px",color:"#94A3B8",lineHeight:1.6,marginBottom:"16px"}}>{p.bio}</p>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:"14px"}}>
                <span style={{fontSize:"13px",color:"#64748B"}}><strong style={{color:"#E2E8F0"}}>{p.jobs}</strong> jobs done</span>
                <button className="sb-btn-primary" style={{padding:"8px 20px",fontSize:"13px"}}>Hire Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JobMarketplace({setModal}) {
  const [search,setSearch]=useState(""); const [district,setDistrict]=useState("All"); const [cat,setCat]=useState("All");
  const filtered = jobs.filter(j=>(district==="All"||j.district===district)&&(cat==="All"||j.type===cat)&&(j.title.toLowerCase().includes(search.toLowerCase())));
  const typeColors={"Design":"#7C3AED","Web Dev":"#06B6D4","Electrical":"#F59E0B","Photography":"#EC4899","Video":"#8B5CF6","Solar":"#F97316"};
  return (
    <section className="sb-section">
      <div className="sb-container">
        <div style={{textAlign:"center",marginBottom:"48px"}}>
          <div className="sb-tag" style={{background:"rgba(16,185,129,0.15)",color:"#10B981",border:"1px solid rgba(16,185,129,0.3)",marginBottom:"16px"}}>Job Marketplace</div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(28px,4vw,44px)",marginBottom:"16px"}}>Find <span className="sb-gradient-text">Opportunities</span> Near You</h2>
        </div>
        <div className="sb-glass" style={{borderRadius:"20px",padding:"24px",marginBottom:"28px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:"12px",alignItems:"center",flexWrap:"wrap"}}>
            <input placeholder="🔍  Search jobs, skills, keywords..." value={search} onChange={e=>setSearch(e.target.value)} style={{fontSize:"15px"}}/>
            <select value={district} onChange={e=>setDistrict(e.target.value)} style={{minWidth:"140px"}}>
              {["All","Colombo","Kandy","Galle","Matara","Kurunegala","Jaffna","Negombo"].map(d=><option key={d}>{d}</option>)}
            </select>
            <select value={cat} onChange={e=>setCat(e.target.value)} style={{minWidth:"130px"}}>
              {["All","Design","Web Dev","Electrical","Photography","Video","Solar"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:"20px"}}>
          {filtered.map((j,i)=>(
            <div key={i} className="sb-card" style={{padding:"24px",position:"relative"}}>
              {j.urgent && <span className="badge-new" style={{position:"absolute",top:"16px",right:"16px"}}>🔥 Urgent</span>}
              <div style={{display:"flex",gap:"12px",alignItems:"flex-start",marginBottom:"14px"}}>
                <div style={{width:"46px",height:"46px",borderRadius:"12px",background:`${typeColors[j.type]}22`,border:`1px solid ${typeColors[j.type]}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",flexShrink:0}}>
                  {j.type==="Design"?"🎨":j.type==="Web Dev"?"💻":j.type==="Electrical"?"⚡":j.type==="Photography"?"📸":j.type==="Video"?"🎬":"☀️"}
                </div>
                <div style={{flex:1}}>
                  <h3 style={{fontWeight:700,fontSize:"15px",fontFamily:"'Syne',sans-serif",marginBottom:"4px",lineHeight:1.3}}>{j.title}</h3>
                  <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                    <span className="sb-tag" style={{background:`${typeColors[j.type]}22`,color:typeColors[j.type],border:`1px solid ${typeColors[j.type]}44`}}>{j.type}</span>
                    <span style={{fontSize:"12px",color:"#64748B"}}>📍 {j.district} · {j.posted}</span>
                  </div>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:"14px"}}>
                <div>
                  <div style={{fontSize:"11px",color:"#64748B"}}>Budget</div>
                  <div style={{fontSize:"18px",fontWeight:800,fontFamily:"'Syne',sans-serif",color:"#10B981"}}>{j.budget}</div>
                </div>
                <div style={{display:"flex",gap:"8px"}}>
                  <button className="sb-btn-outline" style={{padding:"8px 14px",fontSize:"13px"}} onClick={()=>setModal(j)}>Details</button>
                  <button className="sb-btn-primary" style={{padding:"8px 20px",fontSize:"13px"}}>Apply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length===0 && <div style={{textAlign:"center",padding:"60px",color:"#475569",fontSize:"16px"}}>No jobs found for your filters. Try adjusting.</div>}
      </div>
    </section>
  );
}

function TrainingSection() {
  return (
    <section className="sb-section" style={{background:"linear-gradient(180deg,transparent,rgba(6,182,212,0.04),transparent)"}}>
      <div className="sb-container">
        <div style={{textAlign:"center",marginBottom:"56px"}}>
          <div className="sb-tag" style={{background:"rgba(124,58,237,0.15)",color:"#A78BFA",border:"1px solid rgba(124,58,237,0.3)",marginBottom:"16px"}}>Training & Courses</div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(28px,4vw,44px)",marginBottom:"16px"}}>Learn. <span className="sb-gradient-text">Grow. Earn.</span></h2>
          <p style={{color:"#64748B",fontSize:"16px"}}>Free and premium courses designed for Sri Lankan youth</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:"24px"}}>
          {courses.map((c,i)=>(
            <div key={i} className="sb-card" style={{padding:"0",overflow:"hidden"}}>
              <div style={{height:"140px",background:`linear-gradient(135deg,${c.color}33,${c.color}11)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"56px",borderBottom:"1px solid rgba(255,255,255,0.07)",position:"relative"}}>
                {c.icon}
                <span className="sb-tag" style={{position:"absolute",top:"12px",right:"12px",background:`${c.color}33`,color:c.color,border:`1px solid ${c.color}55`}}>{c.level}</span>
              </div>
              <div style={{padding:"22px"}}>
                <span className="sb-tag" style={{background:"rgba(255,255,255,0.07)",color:"#94A3B8",marginBottom:"10px",display:"inline-block"}}>{c.category}</span>
                <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"16px",marginBottom:"8px"}}>{c.title}</h3>
                <div style={{display:"flex",gap:"16px",fontSize:"12px",color:"#64748B",marginBottom:"16px"}}>
                  <span>📖 {c.lessons} lessons</span>
                  <span>👥 {c.students.toLocaleString()} students</span>
                </div>
                <div style={{marginBottom:"14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px",fontSize:"12px"}}>
                    <span style={{color:"#94A3B8"}}>Your Progress</span>
                    <span style={{color:c.color,fontWeight:700}}>{c.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width:`${c.progress}%`,background:`linear-gradient(90deg,${c.color},${c.color}aa)`}}></div>
                  </div>
                </div>
                <div style={{display:"flex",gap:"8px"}}>
                  <button className="sb-btn-primary" style={{flex:1,padding:"9px",fontSize:"13px",background:`linear-gradient(135deg,${c.color},${c.color}bb)`}}>Continue Learning</button>
                  <button className="sb-btn-outline" style={{padding:"9px 14px",fontSize:"13px"}}>🎓</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardSection() {
  const tasks = [
    {t:"Logo design for client",d:"Due today",done:false,c:"#7C3AED"},
    {t:"Complete React course module 5",d:"Due tomorrow",done:true,c:"#06B6D4"},
    {t:"Reply to 3 job inquiries",d:"Due today",done:false,c:"#F59E0B"},
    {t:"Upload portfolio images",d:"Due in 3 days",done:false,c:"#10B981"},
  ];
  const notifications = [
    {text:"New job request: Logo design",time:"2m ago",icon:"💼"},
    {text:"Kavindi rated your service ⭐⭐⭐⭐⭐",time:"1h ago",icon:"⭐"},
    {text:"Course certificate earned!",time:"3h ago",icon:"🎓"},
    {text:"Profile verified by SkillBridge",time:"1d ago",icon:"✅"},
  ];
  return (
    <section className="sb-section">
      <div className="sb-container">
        <div style={{marginBottom:"40px"}}>
          <div className="sb-tag" style={{background:"rgba(124,58,237,0.15)",color:"#A78BFA",border:"1px solid rgba(124,58,237,0.3)",marginBottom:"16px"}}>Dashboard</div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(28px,4vw,44px)"}}>Welcome back, <span className="sb-gradient-text">Ravindu</span> 👋</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"16px",marginBottom:"28px"}} className="dash-grid">
          {[["Rs 42,800","This Month","+18%","#7C3AED"],["14","Jobs Active","+3","#06B6D4"],["4.8","Avg Rating","★ Top 5%","#F59E0B"],["87%","Profile Done","Complete now","#10B981"]].map(([v,l,s,c],i)=>(
            <div key={i} className="sb-card" style={{padding:"20px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:"-10px",right:"-10px",width:"80px",height:"80px",background:`${c}22`,borderRadius:"50%"}}></div>
              <div style={{fontSize:"12px",color:"#64748B",marginBottom:"6px"}}>{l}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"22px",marginBottom:"4px"}}>{v}</div>
              <div style={{fontSize:"12px",color:c,fontWeight:600}}>{s}</div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px",marginBottom:"20px"}} className="dash-grid">
          <div className="sb-glass" style={{borderRadius:"20px",padding:"24px"}}>
            <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"16px",marginBottom:"20px"}}>📊 Monthly Earnings</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                <XAxis dataKey="m" tick={{fill:"#64748B",fontSize:12}}/>
                <YAxis tick={{fill:"#64748B",fontSize:11}} tickFormatter={v=>`${v/1000}k`}/>
                <Tooltip contentStyle={{background:"#0D1B2E",border:"1px solid rgba(124,58,237,0.3)",borderRadius:"12px",color:"#E2E8F0"}} formatter={v=>[`Rs ${v.toLocaleString()}`,""]}/>
                <Area type="monotone" dataKey="e" stroke="#7C3AED" fill="url(#eg)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="sb-glass" style={{borderRadius:"20px",padding:"24px"}}>
            <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"16px",marginBottom:"20px"}}>🎯 Skill Demand</h3>
            <div style={{display:"flex",alignItems:"center",gap:"20px"}}>
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={skillPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                    {skillPieData.map((e,i)=><Cell key={i} fill={e.color}/>)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{flex:1}}>
                {skillPieData.map((s,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}}>
                    <div style={{width:"10px",height:"10px",borderRadius:"3px",background:s.color,flexShrink:0}}></div>
                    <span style={{fontSize:"13px",flex:1,color:"#94A3B8"}}>{s.name}</span>
                    <span style={{fontSize:"13px",fontWeight:700}}>{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"}} className="dash-grid">
          <div className="sb-glass" style={{borderRadius:"20px",padding:"24px"}}>
            <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"16px",marginBottom:"20px"}}>📋 Upcoming Tasks</h3>
            {tasks.map((t,i)=>(
              <div key={i} style={{display:"flex",gap:"12px",alignItems:"center",padding:"12px",borderRadius:"12px",background:t.done?"rgba(16,185,129,0.05)":"rgba(255,255,255,0.03)",marginBottom:"8px",border:`1px solid ${t.done?"rgba(16,185,129,0.2)":"rgba(255,255,255,0.07)"}`}}>
                <div style={{width:"18px",height:"18px",borderRadius:"50%",border:`2px solid ${t.done?"#10B981":t.c}`,background:t.done?"#10B981":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",flexShrink:0}}>{t.done?"✓":""}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"13px",fontWeight:600,textDecoration:t.done?"line-through":"none",color:t.done?"#64748B":"#E2E8F0"}}>{t.t}</div>
                  <div style={{fontSize:"11px",color:"#475569"}}>{t.d}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="sb-glass" style={{borderRadius:"20px",padding:"24px"}}>
            <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"16px",marginBottom:"20px"}}>🔔 Notifications</h3>
            {notifications.map((n,i)=>(
              <div key={i} style={{display:"flex",gap:"12px",alignItems:"flex-start",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                <div style={{width:"34px",height:"34px",borderRadius:"10px",background:"rgba(124,58,237,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"15px",flexShrink:0}}>{n.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"13px",lineHeight:1.4}}>{n.text}</div>
                  <div style={{fontSize:"11px",color:"#475569",marginTop:"2px"}}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CommunityImpact() {
  const ref = useRef(); const [started, setStarted] = useState(false);
  useEffect(()=>{
    const obs = new IntersectionObserver(([e])=>{if(e.isIntersecting)setStarted(true)},{threshold:0.3});
    if(ref.current)obs.observe(ref.current); return()=>obs.disconnect();
  },[]);
  const s = useCounter(12400,2000,started), j = useCounter(8200,2500,started), sk = useCounter(350,1800,started), d = useCounter(25,1000,started);
  return (
    <section className="sb-section" ref={ref} style={{background:"linear-gradient(135deg,rgba(124,58,237,0.06),rgba(6,182,212,0.04))"}}>
      <div className="sb-container">
        <div style={{textAlign:"center",marginBottom:"56px"}}>
          <div className="sb-tag" style={{background:"rgba(245,158,11,0.15)",color:"#F59E0B",border:"1px solid rgba(245,158,11,0.3)",marginBottom:"16px"}}>Community Impact</div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(28px,4vw,44px)"}}>Transforming <span className="sb-gradient-text">Young Lives</span> Across Sri Lanka</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"24px"}}>
          {[[s.toLocaleString()+"+","Students Registered","🎓","#7C3AED"],[j.toLocaleString()+"+","Jobs Completed","💼","#06B6D4"],[sk+"+","Skills Offered","⚡","#F59E0B"],[d,"Districts Connected","🗺️","#10B981"]].map(([n,l,ic,c],i)=>(
            <div key={i} className="sb-card stat-glow" style={{padding:"36px 24px",textAlign:"center",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,background:`radial-gradient(circle at 50% 0%,${c}15,transparent 70%)`,pointerEvents:"none"}}></div>
              <div style={{fontSize:"44px",marginBottom:"12px"}}>{ic}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"40px",background:`linear-gradient(135deg,${c},${c}88)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:"8px"}}>{n}</div>
              <div style={{fontSize:"15px",color:"#94A3B8",fontWeight:500}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  return (
    <section className="sb-section">
      <div className="sb-container">
        <div style={{textAlign:"center",marginBottom:"56px"}}>
          <div className="sb-tag" style={{background:"rgba(16,185,129,0.15)",color:"#10B981",border:"1px solid rgba(16,185,129,0.3)",marginBottom:"16px"}}>Success Stories</div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(28px,4vw,44px)"}}>Real Stories, <span className="sb-gradient-text">Real Impact</span></h2>
        </div>
        <div style={{maxWidth:"700px",margin:"0 auto"}}>
          <div className="sb-glass-strong" style={{borderRadius:"24px",padding:"40px",textAlign:"center",position:"relative",minHeight:"260px"}}>
            <div style={{fontSize:"60px",color:"rgba(124,58,237,0.3)",fontFamily:"serif",lineHeight:1,marginBottom:"20px"}}>"</div>
            <p style={{fontSize:"17px",lineHeight:1.8,color:"#CBD5E1",marginBottom:"28px",fontStyle:"italic"}}>{testimonials[idx].text}</p>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"14px"}}>
              <div style={{width:"48px",height:"48px",borderRadius:"50%",background:"linear-gradient(135deg,#7C3AED,#06B6D4)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:"18px"}}>
                {testimonials[idx].name[0]}
              </div>
              <div style={{textAlign:"left"}}>
                <div style={{fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{testimonials[idx].name}</div>
                <div style={{fontSize:"13px",color:"#64748B"}}>{testimonials[idx].skill} · {testimonials[idx].district}</div>
              </div>
              <Stars n={testimonials[idx].rating}/>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:"10px",marginTop:"24px"}}>
            {testimonials.map((_,i)=>(
              <button key={i} onClick={()=>setIdx(i)} style={{width:i===idx?"28px":"10px",height:"10px",borderRadius:"5px",background:i===idx?"linear-gradient(90deg,#7C3AED,#06B6D4)":"rgba(255,255,255,0.2)",border:"none",cursor:"pointer",transition:"all 0.3s"}}></button>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:"12px",marginTop:"16px"}}>
            <button className="sb-btn-outline" style={{padding:"8px 20px",fontSize:"13px"}} onClick={()=>setIdx((idx-1+testimonials.length)%testimonials.length)}>← Prev</button>
            <button className="sb-btn-outline" style={{padding:"8px 20px",fontSize:"13px"}} onClick={()=>setIdx((idx+1)%testimonials.length)}>Next →</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const points = [
    { icon:"🎯", title:"Our Mission", text:"Connecting Sri Lankan youth with economic opportunities through a digital skills marketplace that bridges the gap between education and employment." },
    { icon:"🌱", title:"SDG 8 Commitment", text:"Actively supporting UN Sustainable Development Goal 8 — promoting inclusive and sustainable economic growth, full employment, and decent work for all." },
    { icon:"🏘️", title:"Rural Empowerment", text:"Bringing digital opportunities to rural communities across all 25 districts, ensuring no talented youth is left behind due to geography." },
    { icon:"🚀", title:"Entrepreneurship", text:"Equipping young Sri Lankans with the tools, knowledge, and networks needed to build their own businesses and create employment for others." },
  ];
  return (
    <section className="sb-section">
      <div className="sb-container">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"60px",alignItems:"center"}} className="dash-grid">
          <div>
            <div className="sb-tag" style={{background:"rgba(124,58,237,0.15)",color:"#A78BFA",border:"1px solid rgba(124,58,237,0.3)",marginBottom:"20px"}}>About SkillBridge</div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(28px,4vw,40px)",marginBottom:"20px",lineHeight:1.2}}>Building the Future of <span className="sb-gradient-text">Youth Employment</span></h2>
            <p style={{color:"#94A3B8",lineHeight:1.8,marginBottom:"28px",fontSize:"15px"}}>SkillBridge Sri Lanka is a social impact platform dedicated to transforming how young Sri Lankans find work, learn new skills, and build sustainable careers. We believe every young person deserves the opportunity to thrive.</p>
            <div style={{display:"flex",gap:"16px"}}>
              <div style={{textAlign:"center",padding:"16px 24px",borderRadius:"16px",background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.2)"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"22px",color:"#A78BFA"}}>2024</div>
                <div style={{fontSize:"12px",color:"#64748B"}}>Founded</div>
              </div>
              <div style={{textAlign:"center",padding:"16px 24px",borderRadius:"16px",background:"rgba(6,182,212,0.1)",border:"1px solid rgba(6,182,212,0.2)"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"22px",color:"#22D3EE"}}>25</div>
                <div style={{fontSize:"12px",color:"#64748B"}}>Districts</div>
              </div>
              <div style={{textAlign:"center",padding:"16px 24px",borderRadius:"16px",background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.2)"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"22px",color:"#10B981"}}>Free</div>
                <div style={{fontSize:"12px",color:"#64748B"}}>To Join</div>
              </div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
            {points.map((p,i)=>(
              <div key={i} className="sb-card" style={{padding:"22px"}}>
                <div style={{fontSize:"28px",marginBottom:"10px"}}>{p.icon}</div>
                <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"14px",marginBottom:"8px"}}>{p.title}</h3>
                <p style={{fontSize:"12px",color:"#64748B",lineHeight:1.6}}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [form, setForm] = useState({name:"",email:"",message:""});
  const [sent, setSent] = useState(false);
  const send = () => { if(form.name&&form.email&&form.message){setSent(true);setTimeout(()=>setSent(false),3000);setForm({name:"",email:"",message:""});} };
  return (
    <section className="sb-section" style={{background:"linear-gradient(180deg,transparent,rgba(124,58,237,0.05),transparent)"}}>
      <div className="sb-container">
        <div style={{textAlign:"center",marginBottom:"56px"}}>
          <div className="sb-tag" style={{background:"rgba(6,182,212,0.15)",color:"#22D3EE",border:"1px solid rgba(6,182,212,0.3)",marginBottom:"16px"}}>Contact Us</div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(28px,4vw,44px)"}}>Get In <span className="sb-gradient-text">Touch</span></h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"48px",maxWidth:"900px",margin:"0 auto"}} className="dash-grid">
          <div>
            <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"20px",marginBottom:"16px"}}>Let's Connect</h3>
            <p style={{color:"#64748B",lineHeight:1.7,marginBottom:"28px",fontSize:"15px"}}>Have questions about SkillBridge? Want to partner with us or list your organization? We'd love to hear from you.</p>
            {[["📧","info@skillbridge.lk"],["📞","+94 11 234 5678"],["📍","Colombo 07, Sri Lanka"]].map(([ic,t],i)=>(
              <div key={i} style={{display:"flex",gap:"12px",alignItems:"center",marginBottom:"14px",color:"#94A3B8",fontSize:"15px"}}>
                <div style={{width:"38px",height:"38px",borderRadius:"10px",background:"rgba(124,58,237,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>{ic}</div>
                {t}
              </div>
            ))}
            <div style={{display:"flex",gap:"12px",marginTop:"24px"}}>
              {["🐦","📘","💼","📸"].map((ic,i)=>(
                <div key={i} style={{width:"40px",height:"40px",borderRadius:"10px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.3s",fontSize:"18px"}}>{ic}</div>
              ))}
            </div>
          </div>
          <div className="sb-glass" style={{borderRadius:"20px",padding:"28px"}}>
            {sent ? (
              <div style={{textAlign:"center",padding:"40px 20px"}}>
                <div style={{fontSize:"48px",marginBottom:"16px"}}>✅</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"20px",marginBottom:"8px"}}>Message Sent!</div>
                <div style={{color:"#64748B"}}>We'll get back to you soon.</div>
              </div>
            ) : (
              <>
                <div style={{marginBottom:"16px"}}>
                  <label style={{fontSize:"13px",color:"#94A3B8",marginBottom:"6px",display:"block"}}>Your Name</label>
                  <input placeholder="Kavindi Perera" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
                </div>
                <div style={{marginBottom:"16px"}}>
                  <label style={{fontSize:"13px",color:"#94A3B8",marginBottom:"6px",display:"block"}}>Email Address</label>
                  <input placeholder="kavindi@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
                </div>
                <div style={{marginBottom:"20px"}}>
                  <label style={{fontSize:"13px",color:"#94A3B8",marginBottom:"6px",display:"block"}}>Message</label>
                  <textarea placeholder="Tell us how we can help..." rows={4} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} style={{resize:"vertical"}}/>
                </div>
                <button className="sb-btn-primary" style={{width:"100%",padding:"13px",fontSize:"15px"}} onClick={send}>🚀 Send Message</button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({setActivePage}) {
  return (
    <footer style={{borderTop:"1px solid rgba(255,255,255,0.07)",padding:"60px 0 32px",background:"rgba(0,0,0,0.3)"}}>
      <div className="sb-container">
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:"40px",marginBottom:"48px"}} className="grid-3">
          <div>
            <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"16px"}}>
              <div style={{width:"40px",height:"40px",background:"linear-gradient(135deg,#7C3AED,#06B6D4)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px"}}>🌉</div>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"18px"}}>SkillBridge</div>
                <div style={{fontSize:"10px",color:"#64748B",letterSpacing:"2px"}}>SRI LANKA</div>
              </div>
            </div>
            <p style={{color:"#64748B",fontSize:"14px",lineHeight:1.7,maxWidth:"280px",marginBottom:"20px"}}>Empowering Sri Lankan youth through skills, opportunities, and community — supporting UN SDG 8 for decent work and economic growth.</p>
            <div style={{display:"inline-flex",alignItems:"center",gap:"6px",background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.25)",borderRadius:"8px",padding:"6px 12px",fontSize:"12px",color:"#10B981",fontWeight:600}}>
              🌱 Supporting UN SDG 8
            </div>
          </div>
          {[["Platform",["Find Jobs","Offer Skills","Courses","Community","Dashboard"]],["Company",["About Us","Blog","Partners","Careers","Contact"]],["Support",["Help Center","Privacy Policy","Terms of Use","District Offices","Feedback"]]].map(([title,links])=>(
            <div key={title}>
              <h4 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"14px",marginBottom:"16px",letterSpacing:"0.5px",textTransform:"uppercase",color:"#94A3B8"}}>{title}</h4>
              {links.map(l=><div key={l} style={{color:"#64748B",fontSize:"14px",marginBottom:"10px",cursor:"pointer",transition:"color 0.2s"}} onMouseOver={e=>e.target.style.color="#A78BFA"} onMouseOut={e=>e.target.style.color="#64748B"}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:"24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px"}}>
          <div style={{fontSize:"13px",color:"#475569"}}>© 2024 SkillBridge Sri Lanka. All rights reserved.</div>
          <div style={{fontSize:"13px",color:"#64748B",textAlign:"center"}}>
            Designed & Developed by <span style={{background:"linear-gradient(135deg,#A78BFA,#38BDF8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontWeight:700}}>Hashan Munasinghe</span>
          </div>
          <div style={{fontSize:"12px",color:"#475569"}}>🌍 Supporting <span style={{color:"#10B981",fontWeight:600}}>UN SDG 8</span></div>
        </div>
      </div>
    </footer>
  );
}

function JobModal({job, onClose}) {
  if(!job) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="sb-glass-strong" style={{borderRadius:"24px",padding:"36px",maxWidth:"480px",width:"90%",animation:"slide-in-up 0.3s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"20px"}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"20px",lineHeight:1.3,flex:1}}>{job.title}</h2>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.1)",border:"none",color:"#E2E8F0",width:"32px",height:"32px",borderRadius:"8px",cursor:"pointer",fontSize:"16px",marginLeft:"12px",flexShrink:0}}>✕</button>
        </div>
        {[["Category",job.type],["District",job.district],["Budget",job.budget],["Posted",job.posted],["Status",job.urgent?"🔥 Urgent":"Regular"]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.07)",fontSize:"14px"}}>
            <span style={{color:"#64748B"}}>{k}</span>
            <span style={{fontWeight:600}}>{v}</span>
          </div>
        ))}
        <p style={{color:"#94A3B8",fontSize:"14px",lineHeight:1.7,marginTop:"16px",marginBottom:"24px"}}>We are looking for a skilled professional to help with this project. Please apply with your portfolio and expected timeline. Payment upon completion.</p>
        <div style={{display:"flex",gap:"10px"}}>
          <button className="sb-btn-primary" style={{flex:1,padding:"12px",fontSize:"15px"}}>Apply Now</button>
          <button className="sb-btn-outline" style={{padding:"12px 20px",fontSize:"15px"}}>💬 Message</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("Home");
  const [modal, setModal] = useState(null);

  const renderContent = () => {
    switch(page) {
      case "Home": return (
        <>
          <HeroSection setActivePage={setPage}/>
          <FeaturesSection/>
          <ProfilesSection/>
          <CommunityImpact/>
          <TestimonialsSection/>
          <AboutSection/>
          <ContactSection/>
        </>
      );
      case "Explore Skills": return <><ProfilesSection/><FeaturesSection/></>;
      case "Find Workers": return <JobMarketplace setModal={setModal}/>;
      case "Training": return <TrainingSection/>;
      case "Dashboard": return <DashboardSection/>;
      case "About": return <><AboutSection/><CommunityImpact/></>;
      case "Contact": return <ContactSection/>;
      default: return <HeroSection setActivePage={setPage}/>;
    }
  };

  return (
    <div style={{minHeight:"100vh",background:"#050D1A",fontFamily:"'Nunito',sans-serif"}}>
      <style>{STYLES}</style>
      <TopBanner/>
      <Navbar activePage={page} setActivePage={setPage}/>
      <main style={{paddingTop: page!=="Home" ? "108px" : "0"}}>
        {renderContent()}
      </main>
      <Footer setActivePage={setPage}/>
      {modal && <JobModal job={modal} onClose={()=>setModal(null)}/>}
      <ContactRobot/>
    </div>
  );
}
