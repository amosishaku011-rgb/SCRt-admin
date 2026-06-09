import { useState, useEffect } from "react";

// ─── Shared Storage (same localStorage keys as student app) ──────────────────
const DATA_VERSION = "v10";
const db = {
  async get(k)   { try { const v=localStorage.getItem(k); return v?JSON.parse(v):null; } catch{return null;} },
  async set(k,v) { try { localStorage.setItem(k,JSON.stringify(v)); } catch{} },
};

// ─── Seed Data (must match student app exactly) ───────────────────────────────
const SEED_SCHOOLS = [
  {id:"uic",         name:"University of Illinois Chicago",     short:"UIC",    type:"university"},
  {id:"illinois",    name:"Univ. of Illinois Urbana-Champaign", short:"UIUC",   type:"university"},
  {id:"northwestern",name:"Northwestern University",            short:"NU",     type:"university"},
  {id:"depaul",      name:"DePaul University",                  short:"DePaul", type:"university"},
  {id:"cod",         name:"College of DuPage",                  short:"COD",    type:"community"},
  {id:"truman",      name:"Harry S Truman College",             short:"Truman", type:"community"},
  {id:"oakton",      name:"Oakton Community College",           short:"Oakton", type:"community"},
];
const SEED_PROGRAMS = [
  {id:"che_uic",   name:"Chemical Engineering",   school:"uic",          totalCredits:132, icon:"⚗️"},
  {id:"che_uiuc",  name:"Chemical Engineering",   school:"illinois",     totalCredits:130, icon:"⚗️"},
  {id:"cs_uic",    name:"Computer Science",       school:"uic",          totalCredits:120, icon:"💻"},
  {id:"bus_uic",   name:"Business Administration",school:"uic",          totalCredits:120, icon:"📊"},
  {id:"bus_depaul",name:"Business Administration",school:"depaul",       totalCredits:120, icon:"📊"},
  {id:"nurs_uic",  name:"Nursing (BSN)",          school:"uic",          totalCredits:128, icon:"🏥"},
  {id:"me_uiuc",   name:"Mechanical Engineering", school:"illinois",     totalCredits:130, icon:"⚙️"},
  {id:"psyc_nu",   name:"Psychology",             school:"northwestern", totalCredits:120, icon:"🧠"},
  {id:"fin_depaul",name:"Finance",                school:"depaul",       totalCredits:120, icon:"💰"},
];
const SEED_CC = {
  cod:[
    {code:"MATH 2231",name:"Calculus I",                  credits:5},
    {code:"MATH 2232",name:"Calculus II",                 credits:4},
    {code:"MATH 2233",name:"Calculus III",                credits:4},
    {code:"MATH 2255",name:"Differential Equations",      credits:3},
    {code:"PHYS 2111",name:"Physics I — Mechanics",       credits:4},
    {code:"PHYS 2112",name:"Physics II — E&M",            credits:4},
    {code:"CHEM 1551",name:"General Chemistry I",         credits:4},
    {code:"CHEM 1552",name:"General Chemistry II",        credits:4},
    {code:"CHEM 1553",name:"Gen. Chemistry Lab I",        credits:1},
    {code:"CHEM 1554",name:"Gen. Chemistry Lab II",       credits:1},
    {code:"CHEM 2210",name:"Organic Chemistry I",         credits:4},
    {code:"ENGR 1100",name:"Introduction to Engineering", credits:1},
    {code:"CIS 2531", name:"Scientific Programming",      credits:3},
    {code:"ENGL 1101",name:"Composition I",               credits:3},
    {code:"ENGL 1102",name:"Composition II",              credits:3},
    {code:"ECON 2201",name:"Microeconomics",              credits:3},
    {code:"ECON 2202",name:"Macroeconomics",              credits:3},
    {code:"ACCT 1101",name:"Financial Accounting",        credits:4},
    {code:"BIOL 1151",name:"Anatomy & Physiology I",      credits:4},
    {code:"BIOL 1152",name:"Anatomy & Physiology II",     credits:4},
    {code:"BIOL 2210",name:"Microbiology",                credits:4},
    {code:"PSYC 1100",name:"General Psychology",          credits:3},
  ],
  truman:[
    {code:"MTH 205",  name:"Calculus I",                  credits:5},
    {code:"MTH 206",  name:"Calculus II",                 credits:4},
    {code:"MTH 207",  name:"Calculus III",                credits:4},
    {code:"MTH 212",  name:"Differential Equations",      credits:3},
    {code:"PHY 201",  name:"Physics I — Mechanics",       credits:4},
    {code:"PHY 202",  name:"Physics II — E&M",            credits:4},
    {code:"CHM 201",  name:"General Chemistry I",         credits:4},
    {code:"CHM 202",  name:"General Chemistry II",        credits:4},
    {code:"CHM 201L", name:"Gen. Chemistry Lab I",        credits:1},
    {code:"CHM 202L", name:"Gen. Chemistry Lab II",       credits:1},
    {code:"CHM 211",  name:"Organic Chemistry I",         credits:4},
    {code:"ENG 101",  name:"Composition I",               credits:3},
    {code:"ENG 102",  name:"Composition II",              credits:3},
    {code:"CSC 111",  name:"Scientific Programming",      credits:3},
    {code:"ECO 201",  name:"Microeconomics",              credits:3},
    {code:"ECO 202",  name:"Macroeconomics",              credits:3},
    {code:"ACC 101",  name:"Financial Accounting",        credits:4},
    {code:"BIO 201",  name:"Anatomy & Physiology I",      credits:4},
    {code:"BIO 202",  name:"Anatomy & Physiology II",     credits:4},
    {code:"PSY 101",  name:"General Psychology",          credits:3},
  ],
  oakton:[
    {code:"MAT 251",  name:"Calculus I",                  credits:5},
    {code:"MAT 252",  name:"Calculus II",                 credits:4},
    {code:"MAT 253",  name:"Calculus III",                credits:4},
    {code:"MAT 260",  name:"Differential Equations",      credits:3},
    {code:"PHY 221",  name:"Physics I — Mechanics",       credits:4},
    {code:"PHY 222",  name:"Physics II — E&M",            credits:4},
    {code:"CHM 210",  name:"General Chemistry I",         credits:4},
    {code:"CHM 211",  name:"General Chemistry II",        credits:4},
    {code:"CHM 210L", name:"Gen. Chemistry Lab I",        credits:1},
    {code:"CHM 211L", name:"Gen. Chemistry Lab II",       credits:1},
    {code:"CHM 220",  name:"Organic Chemistry I",         credits:4},
    {code:"EGL 101",  name:"Composition I",               credits:3},
    {code:"EGL 102",  name:"Composition II",              credits:3},
    {code:"CSC 155",  name:"Scientific Programming",      credits:3},
    {code:"ECN 211",  name:"Microeconomics",              credits:3},
    {code:"ECN 212",  name:"Macroeconomics",              credits:3},
    {code:"ACT 101",  name:"Financial Accounting",        credits:4},
    {code:"BIO 231",  name:"Anatomy & Physiology I",      credits:4},
    {code:"BIO 232",  name:"Anatomy & Physiology II",     credits:4},
    {code:"PSY 101",  name:"General Psychology",          credits:3},
  ],
};
const SEED_TRANSFER = {};
const SEED_REQS = {
  che_uic:[
    {code:"ENGR 100",name:"Introduction to Engineering",      credits:1, semHint:1},
    {code:"MATH 180",name:"Calculus I",                       credits:5, semHint:1},
    {code:"MATH 181",name:"Calculus II",                      credits:4, semHint:1},
    {code:"CHEM 122",name:"General Chemistry I",              credits:3, semHint:1},
    {code:"CHEM 123",name:"General Chemistry II",             credits:3, semHint:1},
    {code:"CHEM 124",name:"Gen. Chemistry Lab I",             credits:1, semHint:1},
    {code:"CHEM 125",name:"Gen. Chemistry Lab II",            credits:1, semHint:1},
    {code:"PHYS 141",name:"Physics I — Mechanics",            credits:4, semHint:1},
    {code:"CS 109",  name:"Intro to Scientific Programming",  credits:3, semHint:1},
    {code:"MATH 210",name:"Calculus III",                     credits:3, semHint:2},
    {code:"MATH 220",name:"Differential Equations",           credits:3, semHint:2},
    {code:"PHYS 142",name:"Physics II — E&M",                 credits:4, semHint:2},
    {code:"CHEM 232",name:"Organic Chemistry I",              credits:3, semHint:2},
    {code:"CHE 201", name:"Material & Energy Balances",       credits:3, semHint:2},
    {code:"CHE 205", name:"CHE Thermodynamics I",             credits:3, semHint:2},
    {code:"CHE 210", name:"CHE Lab I",                        credits:2, semHint:2},
    {code:"CHE 301", name:"CHE Thermodynamics II",            credits:3, semHint:3},
    {code:"CHE 311", name:"Fluid Mechanics",                  credits:3, semHint:3},
    {code:"CHE 312", name:"Heat Transfer",                    credits:3, semHint:3},
    {code:"CHE 313", name:"Mass Transfer",                    credits:3, semHint:3},
    {code:"CHE 321", name:"Chemical Reaction Engineering",    credits:3, semHint:3},
    {code:"CHE 342", name:"Process Dynamics & Control",       credits:3, semHint:3},
    {code:"CHEM 222",name:"Organic Chemistry II",             credits:3, semHint:3},
    {code:"CHEM 230",name:"Organic Chemistry Lab",            credits:1, semHint:3},
    {code:"CHEM 233",name:"Analytical Chemistry Lab",         credits:2, semHint:3},
    {code:"CHEM 234",name:"Quantitative Analysis",            credits:3, semHint:3},
    {code:"CME 322", name:"Intro to Materials Science",       credits:3, semHint:3},
    {code:"ECE 210", name:"Electrical Circuits",              credits:3, semHint:4},
    {code:"CME 260", name:"Mechanics of Materials",           credits:3, semHint:4},
    {code:"CHE 330", name:"CHE Lab II",                       credits:3, semHint:4},
    {code:"CHE 341", name:"Process Design I",                 credits:3, semHint:4},
    {code:"CHE 381", name:"Technical Elective I",             credits:3, semHint:5},
    {code:"CHE 382", name:"Technical Elective II",            credits:3, semHint:5},
    {code:"CHE 396", name:"Professional Development",         credits:1, semHint:5},
    {code:"CHE 397", name:"Technical Communication",          credits:2, semHint:5},
    {code:"CHE 451", name:"Process Design II",                credits:3, semHint:5},
    {code:"CHE 499", name:"Senior Capstone",                  credits:3, semHint:6},
    {code:"CHE 4xx", name:"Advanced Technical Elective",      credits:3, semHint:6},
  ],
};

const ADMINS = {
  "admin@uic.edu":         {password:"uic2024",   schoolId:"uic",          schoolName:"University of Illinois Chicago",  schoolType:"university"},
  "admin@illinois.edu":    {password:"uiuc2024",  schoolId:"illinois",     schoolName:"UIUC",                            schoolType:"university"},
  "admin@northwestern.edu":{password:"nu2024",    schoolId:"northwestern", schoolName:"Northwestern University",         schoolType:"university"},
  "admin@depaul.edu":      {password:"depaul2024",schoolId:"depaul",       schoolName:"DePaul University",              schoolType:"university"},
  "admin@cod.edu":         {password:"cod2024",   schoolId:"cod",          schoolName:"College of DuPage",              schoolType:"community"},
  "admin@truman.edu":      {password:"truman2024",schoolId:"truman",       schoolName:"Harry S Truman College",         schoolType:"community"},
  "admin@oakton.edu":      {password:"oakton2024",schoolId:"oakton",       schoolName:"Oakton Community College",       schoolType:"community"},
};

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  :root {
    --bg:    #f4f6f9;
    --bg1:   #ffffff;
    --bg2:   #eef1f5;
    --border:#dde2ea;
    --text0: #0d1117;
    --text1: #2d3748;
    --text2: #718096;
    --text3: #a0aec0;
    --accent:#6c63ff;
    --green: #38a169;
    --orange:#dd6b20;
    --purple:#805ad5;
    --red:   #e53e3e;
    --blue:  #3182ce;
  }
  body { font-family:'Inter',sans-serif; background:var(--bg); color:var(--text1); }
  .app { display:flex; min-height:100vh; }

  /* ── Sidebar ── */
  .sidebar { width:240px; background:var(--text0); color:#fff; display:flex; flex-direction:column; flex-shrink:0; }
  .sidebar-logo { padding:24px 20px 20px; border-bottom:1px solid rgba(255,255,255,0.08); }
  .sidebar-logo-title { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:#fff; }
  .sidebar-logo-sub { font-size:11px; color:rgba(255,255,255,0.4); margin-top:2px; }
  .sidebar-user { padding:16px 20px; border-bottom:1px solid rgba(255,255,255,0.08); }
  .sidebar-user-name { font-size:13px; font-weight:600; color:#fff; }
  .sidebar-user-role { font-size:11px; color:rgba(255,255,255,0.4); margin-top:2px; }
  .sidebar-nav { padding:12px 0; flex:1; }
  .nav-item { display:flex; align-items:center; gap:10px; padding:10px 20px; font-size:13px; font-weight:500; color:rgba(255,255,255,0.55); cursor:pointer; transition:all 0.15s; border-left:3px solid transparent; }
  .nav-item:hover { background:rgba(255,255,255,0.06); color:#fff; }
  .nav-item.active { background:rgba(108,99,255,0.18); color:#fff; border-left-color:var(--accent); }
  .nav-icon { font-size:16px; width:20px; text-align:center; }
  .sidebar-footer { padding:16px 20px; border-top:1px solid rgba(255,255,255,0.08); }
  .logout-btn { width:100%; padding:8px; background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.1); color:rgba(255,255,255,0.6); border-radius:6px; font-size:12px; cursor:pointer; font-family:'Inter',sans-serif; }
  .logout-btn:hover { background:rgba(255,255,255,0.12); color:#fff; }

  /* ── Main ── */
  .main { flex:1; overflow:auto; }
  .page-header { background:var(--bg1); border-bottom:1px solid var(--border); padding:20px 32px; }
  .page-title { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:var(--text0); }
  .page-sub { font-size:13px; color:var(--text2); margin-top:4px; }
  .page-body { padding:28px 32px; }

  /* ── Cards ── */
  .card { background:var(--bg1); border:1px solid var(--border); border-radius:10px; overflow:hidden; }
  .card-header { padding:16px 20px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
  .card-title { font-size:14px; font-weight:600; color:var(--text0); }
  .card-body { padding:20px; }

  /* ── Tabs ── */
  .tab-bar { display:flex; gap:4px; border-bottom:1px solid var(--border); padding:0 32px; background:var(--bg1); }
  .tab { padding:12px 16px; font-size:13px; font-weight:500; color:var(--text2); cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1px; white-space:nowrap; }
  .tab.active { color:var(--accent); border-bottom-color:var(--accent); font-weight:600; }

  /* ── Tables ── */
  .table-wrap { overflow-x:auto; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  th { background:var(--bg2); padding:10px 14px; text-align:left; font-size:11px; font-weight:600; color:var(--text2); text-transform:uppercase; letter-spacing:0.05em; border-bottom:1px solid var(--border); }
  td { padding:12px 14px; border-bottom:1px solid var(--border); color:var(--text1); vertical-align:middle; }
  tr:last-child td { border-bottom:none; }
  tr:hover td { background:var(--bg2); }

  /* ── Transfer rule row ── */
  .rule-row td { padding:8px 14px; }
  .type-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; white-space:nowrap; }
  .type-degree   { background:#c6f6d5; color:#276749; }
  .type-reduced  { background:#feebc8; color:#9c4221; }
  .type-elective { background:#e9d8fd; color:#553c9a; }
  .type-none     { background:#fed7d7; color:#9b2c2c; }
  .type-pending  { background:#e2e8f0; color:#4a5568; }

  /* ── Inline rule editor ── */
  .rule-editor { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  select, input[type=number], input[type=text] {
    padding:5px 10px; border:1px solid var(--border); border-radius:6px;
    font-size:12px; font-family:'Inter',sans-serif; color:var(--text0);
    background:var(--bg1); outline:none;
  }
  select:focus, input:focus { border-color:var(--accent); }
  .save-btn { padding:5px 14px; background:var(--accent); color:#fff; border:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; font-family:'Inter',sans-serif; }
  .save-btn:hover { opacity:0.88; }
  .saved-badge { font-size:11px; color:var(--green); font-weight:600; }

  /* ── Filters ── */
  .filter-bar { display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:16px; }
  .filter-bar select { padding:7px 12px; font-size:13px; }
  .search-inp { padding:7px 12px; border:1px solid var(--border); border-radius:6px; font-size:13px; font-family:'Inter',sans-serif; outline:none; min-width:200px; }
  .search-inp:focus { border-color:var(--accent); }

  /* ── Stats bar ── */
  .stats-row { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px; margin-bottom:24px; }
  .stat-card { background:var(--bg1); border:1px solid var(--border); border-radius:10px; padding:16px; }
  .stat-n { font-size:26px; font-weight:700; color:var(--text0); }
  .stat-l { font-size:12px; color:var(--text2); margin-top:2px; }

  /* ── CC course form ── */
  .form-grid { display:grid; grid-template-columns:1fr 2fr auto; gap:10px; align-items:end; margin-bottom:16px; }
  .form-group label { display:block; font-size:11px; font-weight:600; color:var(--text2); margin-bottom:4px; text-transform:uppercase; letter-spacing:0.04em; }
  .form-group input { width:100%; padding:8px 12px; border:1px solid var(--border); border-radius:6px; font-size:13px; font-family:'Inter',sans-serif; }
  .add-btn { padding:8px 18px; background:var(--accent); color:#fff; border:none; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer; font-family:'Inter',sans-serif; white-space:nowrap; }
  .del-btn { background:none; border:none; color:var(--red); cursor:pointer; font-size:16px; padding:4px 8px; border-radius:4px; }
  .del-btn:hover { background:#fed7d7; }

  /* ── Login ── */
  .login-wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--bg); }
  .login-card { background:var(--bg1); border:1px solid var(--border); border-radius:14px; padding:40px; width:380px; }
  .login-logo { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; color:var(--text0); margin-bottom:6px; }
  .login-sub { font-size:13px; color:var(--text2); margin-bottom:28px; }
  .login-label { display:block; font-size:12px; font-weight:600; color:var(--text2); margin-bottom:6px; }
  .login-input { width:100%; padding:10px 14px; border:1px solid var(--border); border-radius:8px; font-size:14px; font-family:'Inter',sans-serif; margin-bottom:14px; outline:none; }
  .login-input:focus { border-color:var(--accent); }
  .login-btn { width:100%; padding:11px; background:var(--accent); color:#fff; border:none; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; font-family:'Inter',sans-serif; }
  .login-err { font-size:12px; color:var(--red); margin-bottom:12px; }
  .demo-accounts { margin-top:20px; background:var(--bg2); border-radius:8px; padding:14px; }
  .demo-title { font-size:11px; font-weight:700; color:var(--text2); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px; }
  .demo-row { display:flex; justify-content:space-between; align-items:center; padding:5px 0; border-bottom:1px solid var(--border); cursor:pointer; }
  .demo-row:last-child { border-bottom:none; }
  .demo-row:hover { opacity:0.7; }
  .demo-name { font-size:12px; font-weight:600; color:var(--text0); }
  .demo-cred { font-size:11px; color:var(--text2); font-family:monospace; }

  /* ── Req editor ── */
  .req-grid { display:grid; grid-template-columns:120px 1fr 60px 80px auto; gap:8px; align-items:end; margin-bottom:10px; }
  .empty-state { text-align:center; padding:40px; color:var(--text3); font-size:14px; }
  .badge-count { display:inline-block; background:var(--accent); color:#fff; border-radius:10px; padding:1px 7px; font-size:10px; font-weight:700; margin-left:6px; }
  .info-box { background:#ebf8ff; border:1px solid #bee3f8; border-radius:8px; padding:12px 16px; font-size:13px; color:#2b6cb0; margin-bottom:16px; }
  .warn-box { background:#fffbeb; border:1px solid #fef08a; border-radius:8px; padding:12px 16px; font-size:13px; color:#92400e; margin-bottom:16px; }

  @media(max-width:700px){
    .sidebar{display:none;}
    .page-body{padding:16px;}
    .form-grid{grid-template-columns:1fr;}
    .req-grid{grid-template-columns:1fr 1fr;}
  }
`;

// ─── Login ────────────────────────────────────────────────────────────────────
function Login({onLogin}) {
  const [email,setEmail] = useState("");
  const [pass,setPass]   = useState("");
  const [err,setErr]     = useState("");

  const attempt = () => {
    const key = email.trim().toLowerCase();
    const acc  = ADMINS[key];
    if (acc && acc.password===pass) { onLogin({email:key,...acc}); }
    else setErr("Invalid email or password.");
  };

  const fill = (e,p) => { setEmail(e); setPass(p); setErr(""); };

  return (
    <div className="login-wrap">
      <style>{CSS}</style>
      <div className="login-card">
        <div className="login-logo">SCRt Admin</div>
        <div className="login-sub">Start College Right — Admin Portal</div>
        {err && <div className="login-err">⚠ {err}</div>}
        <label className="login-label">Email</label>
        <input className="login-input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@uic.edu" onKeyDown={e=>e.key==="Enter"&&attempt()}/>
        <label className="login-label">Password</label>
        <input className="login-input" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&attempt()}/>
        <button className="login-btn" onClick={attempt}>Sign In →</button>
        <div className="demo-accounts">
          <div className="demo-title">Demo Accounts — click to fill</div>
          {[
            {name:"UIC (University)",      email:"admin@uic.edu",     pass:"uic2024"},
            {name:"UIUC (University)",     email:"admin@illinois.edu",pass:"uiuc2024"},
            {name:"College of DuPage (CC)",email:"admin@cod.edu",     pass:"cod2024"},
            {name:"Truman College (CC)",   email:"admin@truman.edu",  pass:"truman2024"},
            {name:"Oakton College (CC)",   email:"admin@oakton.edu",  pass:"oakton2024"},
          ].map(d=>(
            <div key={d.email} className="demo-row" onClick={()=>fill(d.email,d.pass)}>
              <span className="demo-name">{d.name}</span>
              <span className="demo-cred">{d.email}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── University Admin Tabs ────────────────────────────────────────────────────

// Tab 1: Transfer Rules — university sees all CC courses and sets rules per program
function TransferRulesTab({admin, programs, schools, ccCourses, transferRules, onSave}) {
  const myPrograms = programs.filter(p=>p.school===admin.schoolId);
  const ccs        = schools.filter(s=>s.type==="community");

  const [progId, setProgId] = useState(myPrograms[0]?.id||"");
  const [ccId,   setCcId]   = useState(ccs[0]?.id||"");
  const [saved,  setSaved]  = useState({});   // ccCode → true (flash)
  const [rules,  setRules]  = useState(transferRules); // local copy

  const prog     = myPrograms.find(p=>p.id===progId);
  const ccSchool = schools.find(s=>s.id===ccId);
  const courses  = ccCourses[ccId]||[];

  // Get current rule for a course in this program
  const getRule = (ccCode) => {
    const arr = rules[progId]||[];
    return arr.find(r=>r.ccId===ccId && r.ccCode===ccCode) || null;
  };

  const setRule = (ccCode, ccCredits, field, value) => {
    const arr   = [...(rules[progId]||[])];
    const idx   = arr.findIndex(r=>r.ccId===ccId && r.ccCode===ccCode);
    const existing = idx>=0 ? arr[idx] : {ccId, ccCode, mapsTo:"", type:"pending", acceptedCredits:ccCredits};
    const updated  = {...existing, [field]:value};
    if (field==="type" && value==="none") { updated.mapsTo=""; updated.acceptedCredits=0; }
    if (field==="type" && (value==="degree"||value==="elective")) { updated.acceptedCredits=ccCredits; }
    if (idx>=0) arr[idx]=updated; else arr.push(updated);
    const newRules = {...rules, [progId]:arr};
    setRules(newRules);
    return newRules;
  };

  const saveRule = async (ccCode, ccCredits, field, value) => {
    const newRules = setRule(ccCode, ccCredits, field, value);
    await onSave(newRules);
    setSaved(p=>({...p,[ccCode]:true}));
    setTimeout(()=>setSaved(p=>({...p,[ccCode]:false})),1500);
  };

  const ruleStats = () => {
    const arr = (rules[progId]||[]).filter(r=>r.ccId===ccId);
    return {
      degree:   arr.filter(r=>r.type==="degree").length,
      reduced:  arr.filter(r=>r.type==="reduced").length,
      elective: arr.filter(r=>r.type==="elective").length,
      none:     arr.filter(r=>r.type==="none").length,
      pending:  courses.length - arr.filter(r=>r.type&&r.type!=="pending").length,
    };
  };

  const stats = ruleStats();

  return (
    <div>
      <div className="info-box">
        📋 You are setting transfer rules for each CC course. For each course below, decide: does it count toward your degree requirements, transfer as elective only, transfer with reduced credits, or not transfer at all?
      </div>

      <div className="filter-bar">
        <div>
          <label style={{fontSize:11,fontWeight:600,color:"var(--text2)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.04em"}}>Program</label>
          <select value={progId} onChange={e=>setProgId(e.target.value)} style={{fontSize:13,padding:"7px 12px"}}>
            {myPrograms.map(p=><option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
          </select>
        </div>
        <div>
          <label style={{fontSize:11,fontWeight:600,color:"var(--text2)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.04em"}}>Community College</label>
          <select value={ccId} onChange={e=>setCcId(e.target.value)} style={{fontSize:13,padding:"7px 12px"}}>
            {ccs.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {prog && ccSchool && (
        <>
          <div className="stats-row" style={{gridTemplateColumns:"repeat(5,1fr)",marginBottom:16}}>
            {[
              {n:stats.degree,   l:"Toward Degree", c:"var(--green)"},
              {n:stats.reduced,  l:"Reduced Credits",c:"var(--orange)"},
              {n:stats.elective, l:"Elective Only",  c:"var(--purple)"},
              {n:stats.none,     l:"Not Accepted",   c:"var(--red)"},
              {n:stats.pending,  l:"Not Yet Set",    c:"var(--text3)"},
            ].map(s=>(
              <div key={s.l} className="stat-card">
                <div className="stat-n" style={{color:s.c,fontSize:22}}>{s.n}</div>
                <div className="stat-l">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">
                {ccSchool.name} courses → {prog.icon} {prog.name} rules
              </div>
              <div style={{fontSize:12,color:"var(--text2)"}}>
                {courses.length} courses · Changes save automatically
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>CC Course</th>
                    <th>Course Name</th>
                    <th style={{textAlign:"center"}}>CC Credits</th>
                    <th>Transfer Decision</th>
                    <th>Maps To (Uni Code)</th>
                    <th>Accepted Credits</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(c=>{
                    const rule = getRule(c.code);
                    const type = rule?.type||"pending";
                    const mapsTo = rule?.mapsTo||"";
                    const accCr  = rule?.acceptedCredits??c.credits;
                    return (
                      <tr key={c.code} className="rule-row">
                        <td><strong style={{fontFamily:"monospace",fontSize:12}}>{c.code}</strong></td>
                        <td style={{color:"var(--text1)"}}>{c.name}</td>
                        <td style={{textAlign:"center"}}>
                          <span className="type-badge" style={{background:"var(--bg2)",color:"var(--text2)"}}>{c.credits}</span>
                        </td>
                        <td>
                          <select value={type}
                            onChange={e=>saveRule(c.code,c.credits,"type",e.target.value)}
                            style={{fontSize:12,
                              color: type==="degree"?"#276749":type==="reduced"?"#9c4221":type==="elective"?"#553c9a":type==="none"?"#9b2c2c":"#4a5568",
                              fontWeight:600
                            }}>
                            <option value="pending">— Not set —</option>
                            <option value="degree">✅ Toward Degree</option>
                            <option value="reduced">⚠️ Reduced Credits</option>
                            <option value="elective">📚 Elective Only</option>
                            <option value="none">❌ Not Accepted</option>
                          </select>
                        </td>
                        <td>
                          {type!=="none" && type!=="pending" ? (
                            <input type="text" value={mapsTo} placeholder="e.g. MATH 180"
                              style={{width:110,fontSize:12}}
                              onChange={e=>setRule(c.code,c.credits,"mapsTo",e.target.value)}
                              onBlur={async e=>{ await saveRule(c.code,c.credits,"mapsTo",e.target.value); }}/>
                          ) : <span style={{color:"var(--text3)",fontSize:12}}>—</span>}
                        </td>
                        <td>
                          {(type==="reduced") ? (
                            <input type="number" value={accCr} min={0} max={c.credits}
                              style={{width:64,fontSize:12}}
                              onChange={e=>setRule(c.code,c.credits,"acceptedCredits",parseInt(e.target.value)||0)}
                              onBlur={async e=>{ await saveRule(c.code,c.credits,"acceptedCredits",parseInt(e.target.value)||0); }}/>
                          ) : type==="degree"||type==="elective" ? (
                            <span style={{fontSize:12,color:"var(--green)",fontWeight:600}}>{c.credits} cr</span>
                          ) : <span style={{color:"var(--text3)",fontSize:12}}>—</span>}
                        </td>
                        <td>
                          {saved[c.code]
                            ? <span className="saved-badge">✓ Saved</span>
                            : <span style={{fontSize:11,color:"var(--text3)"}}>
                                {type==="pending"?"set rule above":""}
                              </span>
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Tab 2: Degree Requirements
function RequirementsTab({admin, programs, requirements, onSave}) {
  const myPrograms = programs.filter(p=>p.school===admin.schoolId);
  const [progId, setProgId] = useState(myPrograms[0]?.id||"");
  const [reqs,   setReqs]   = useState(requirements);
  const [code,   setCode]   = useState("");
  const [name,   setName]   = useState("");
  const [creds,  setCreds]  = useState(3);
  const [sem,    setSem]    = useState(1);
  const [saved,  setSaved]  = useState(false);

  const list = reqs[progId]||[];
  const prog = myPrograms.find(p=>p.id===progId);

  const add = async () => {
    if (!code.trim()||!name.trim()) return;
    const newReqs = {...reqs, [progId]:[...list, {code:code.trim().toUpperCase(), name:name.trim(), credits:parseInt(creds)||3, semHint:parseInt(sem)||1}]};
    setReqs(newReqs);
    await onSave(newReqs);
    setCode(""); setName(""); setCreds(3); setSem(1);
    setSaved(true); setTimeout(()=>setSaved(false),1500);
  };

  const del = async (idx) => {
    const newReqs = {...reqs, [progId]:list.filter((_,i)=>i!==idx)};
    setReqs(newReqs);
    await onSave(newReqs);
  };

  const SEMS = ["Sophomore · Fall","Sophomore · Spring","Junior · Fall","Junior · Spring","Senior · Fall","Senior · Spring"];

  return (
    <div>
      <div className="info-box">
        🎓 Enter all courses required to graduate from this program. These are the courses students still need to take at your university after transfer.
      </div>
      <div className="filter-bar">
        <div>
          <label style={{fontSize:11,fontWeight:600,color:"var(--text2)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.04em"}}>Program</label>
          <select value={progId} onChange={e=>setProgId(e.target.value)} style={{fontSize:13,padding:"7px 12px"}}>
            {myPrograms.map(p=><option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
          </select>
        </div>
      </div>

      {prog && (
        <div className="card" style={{marginBottom:20}}>
          <div className="card-header">
            <div className="card-title">Add Requirement — {prog.icon} {prog.name}</div>
            {saved && <span className="saved-badge">✓ Saved</span>}
          </div>
          <div className="card-body">
            <div style={{display:"grid",gridTemplateColumns:"130px 1fr 80px 160px auto",gap:10,alignItems:"end"}}>
              <div className="form-group">
                <label>Course Code</label>
                <input value={code} onChange={e=>setCode(e.target.value)} placeholder="CHE 201" onKeyDown={e=>e.key==="Enter"&&add()}/>
              </div>
              <div className="form-group">
                <label>Course Name</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Material & Energy Balances" onKeyDown={e=>e.key==="Enter"&&add()}/>
              </div>
              <div className="form-group">
                <label>Credits</label>
                <input type="number" value={creds} min={1} max={6} onChange={e=>setCreds(e.target.value)}/>
              </div>
              <div className="form-group">
                <label>Semester</label>
                <select value={sem} onChange={e=>setSem(e.target.value)} style={{width:"100%",padding:"8px 10px",fontSize:12}}>
                  {SEMS.map((s,i)=><option key={i} value={i+1}>{s}</option>)}
                </select>
              </div>
              <button className="add-btn" onClick={add}>+ Add</button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            Degree Requirements
            <span className="badge-count">{list.length}</span>
          </div>
          <div style={{fontSize:12,color:"var(--text2)"}}>{prog?.totalCredits} total credits to graduate</div>
        </div>
        {list.length===0
          ? <div className="empty-state">No requirements added yet. Add courses above.</div>
          : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Code</th><th>Course Name</th><th>Credits</th><th>Semester</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((r,i)=>(
                    <tr key={i}>
                      <td><strong style={{fontFamily:"monospace",fontSize:12}}>{r.code}</strong></td>
                      <td>{r.name}</td>
                      <td>{r.credits}</td>
                      <td style={{color:"var(--text2)",fontSize:12}}>{SEMS[(r.semHint||1)-1]}</td>
                      <td><button className="del-btn" onClick={()=>del(i)}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </div>
  );
}

// ─── CC Admin Tabs ────────────────────────────────────────────────────────────

function CCCoursesTab({admin, ccCourses, onSave}) {
  const [courses, setCourses] = useState(ccCourses[admin.schoolId]||[]);
  const [code,  setCode]  = useState("");
  const [name,  setName]  = useState("");
  const [creds, setCreds] = useState(3);
  const [saved, setSaved] = useState(false);
  const [q,     setQ]     = useState("");

  const add = async () => {
    if (!code.trim()||!name.trim()) return;
    const entry = {code:code.trim().toUpperCase(), name:name.trim(), credits:parseInt(creds)||3};
    const updated = [...courses, entry];
    setCourses(updated);
    await onSave({...ccCourses, [admin.schoolId]:updated});
    setCode(""); setName(""); setCreds(3);
    setSaved(true); setTimeout(()=>setSaved(false),1500);
  };

  const del = async (idx) => {
    const updated = courses.filter((_,i)=>i!==idx);
    setCourses(updated);
    await onSave({...ccCourses, [admin.schoolId]:updated});
  };

  const filtered = courses.filter(c=>
    !q.trim() ||
    c.code.toLowerCase().includes(q.toLowerCase()) ||
    c.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <div className="info-box">
        📚 Upload your course catalog here. Just enter the course code, name, and credit hours. Universities will decide which ones transfer and for how many credits.
      </div>

      <div className="card" style={{marginBottom:20}}>
        <div className="card-header">
          <div className="card-title">Add Course</div>
          {saved && <span className="saved-badge">✓ Saved</span>}
        </div>
        <div className="card-body">
          <div style={{display:"grid",gridTemplateColumns:"130px 1fr 80px auto",gap:10,alignItems:"end"}}>
            <div className="form-group">
              <label>Course Code</label>
              <input value={code} onChange={e=>setCode(e.target.value)} placeholder="MATH 2231" onKeyDown={e=>e.key==="Enter"&&add()}/>
            </div>
            <div className="form-group">
              <label>Course Name</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Calculus I" onKeyDown={e=>e.key==="Enter"&&add()}/>
            </div>
            <div className="form-group">
              <label>Credits</label>
              <input type="number" value={creds} min={1} max={8} onChange={e=>setCreds(e.target.value)}/>
            </div>
            <button className="add-btn" onClick={add}>+ Add</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Course Catalog <span className="badge-count">{courses.length}</span></div>
          <input className="search-inp" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search courses…" style={{fontSize:12,padding:"5px 10px"}}/>
        </div>
        {filtered.length===0
          ? <div className="empty-state">No courses yet. Add your first course above.</div>
          : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Code</th><th>Course Name</th><th>Credits</th><th></th></tr>
                </thead>
                <tbody>
                  {filtered.map((c,i)=>(
                    <tr key={i}>
                      <td><strong style={{fontFamily:"monospace",fontSize:12}}>{c.code}</strong></td>
                      <td>{c.name}</td>
                      <td>{c.credits} cr</td>
                      <td><button className="del-btn" onClick={()=>del(courses.indexOf(c))}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </div>
  );
}

// ─── Dashboard Shell ──────────────────────────────────────────────────────────
function Dashboard({admin, onLogout}) {
  const [tab,  setTab]  = useState(admin.schoolType==="community" ? "courses" : "transfer");
  const [schools,       setSchools]       = useState(SEED_SCHOOLS);
  const [programs,      setPrograms]      = useState(SEED_PROGRAMS);
  const [ccCourses,     setCcCourses]     = useState(SEED_CC);
  const [transferRules, setTransferRules] = useState(SEED_TRANSFER);
  const [requirements,  setRequirements]  = useState(SEED_REQS);
  const [ready,         setReady]         = useState(false);

  useEffect(()=>{
    (async()=>{
      const ver = await db.get("scrt:version");
      if (ver === DATA_VERSION) {
        const ss = await db.get("scrt:schools");      if(ss) setSchools(ss);
        const sp = await db.get("scrt:programs");     if(sp) setPrograms(sp);
        const sc = await db.get("scrt:courses");      if(sc) setCcCourses(sc);
        const st = await db.get("scrt:transfer");     if(st) setTransferRules(st);
        const sr = await db.get("scrt:requirements"); if(sr) setRequirements(sr);
      }
      setReady(true);
    })();
  },[]);

  const saveCcCourses     = async (v) => { setCcCourses(v);     await db.set("scrt:courses",v); };
  const saveTransferRules = async (v) => { setTransferRules(v); await db.set("scrt:transfer",v); };
  const saveRequirements  = async (v) => { setRequirements(v);  await db.set("scrt:requirements",v); };

  const isUni = admin.schoolType==="university";

  const navItems = isUni
    ? [
        {id:"transfer",  icon:"🔄", label:"Transfer Rules"},
        {id:"requirements",icon:"📋",label:"Degree Requirements"},
      ]
    : [
        {id:"courses", icon:"📚", label:"Course Catalog"},
      ];

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-title">SCRt Admin</div>
            <div className="sidebar-logo-sub">Start College Right</div>
          </div>
          <div className="sidebar-user">
            <div className="sidebar-user-name">{admin.schoolName}</div>
            <div className="sidebar-user-role">{isUni ? "🏛 University Admin" : "🎓 Community College Admin"}</div>
          </div>
          <div className="sidebar-nav">
            {navItems.map(n=>(
              <div key={n.id} className={`nav-item ${tab===n.id?"active":""}`} onClick={()=>setTab(n.id)}>
                <span className="nav-icon">{n.icon}</span>
                {n.label}
              </div>
            ))}
          </div>
          <div className="sidebar-footer">
            <button className="logout-btn" onClick={onLogout}>← Sign Out</button>
          </div>
        </div>

        <div className="main">
          <div className="page-header">
            <div className="page-title">
              {navItems.find(n=>n.id===tab)?.icon} {navItems.find(n=>n.id===tab)?.label}
            </div>
            <div className="page-sub">
              {tab==="transfer"     && "Review CC courses and set transfer decisions for each of your programs."}
              {tab==="requirements" && "Manage degree requirements that students must complete at your university."}
              {tab==="courses"      && "Manage your course catalog. Universities will use this to set transfer rules."}
            </div>
          </div>

          <div className="page-body">
            {!ready
              ? <div style={{color:"var(--text3)",fontSize:14}}>Loading…</div>
              : <>
                  {tab==="transfer"      && <TransferRulesTab admin={admin} programs={programs} schools={schools} ccCourses={ccCourses} transferRules={transferRules} onSave={saveTransferRules}/>}
                  {tab==="requirements"  && <RequirementsTab  admin={admin} programs={programs} requirements={requirements} onSave={saveRequirements}/>}
                  {tab==="courses"       && <CCCoursesTab     admin={admin} ccCourses={ccCourses} onSave={saveCcCourses}/>}
                </>
            }
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AdminApp() {
  const [admin, setAdmin] = useState(null);
  return admin
    ? <Dashboard admin={admin} onLogout={()=>setAdmin(null)}/>
    : <Login onLogin={setAdmin}/>;
}
