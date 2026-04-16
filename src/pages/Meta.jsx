import{useState,useEffect}from"react";
import{getMeta}from"../db";
import TierBadge from"../components/TierBadge";
import Skeleton from"../components/Skeleton";

const TIER_ORDER={"S":0,"A":1,"B":2,"C":3};

const TIER_STYLE={
  S:{border:"rgba(245,158,11,.5)",glow:"0 0 12px rgba(245,158,11,.15)",bar:"#f59e0b",label:"TOP META"},
  A:{border:"rgba(249,115,22,.4)",glow:"none",bar:"#f97316",label:"META SÓLIDO"},
  B:{border:"rgba(74,222,128,.35)",glow:"none",bar:"#4ade80",label:"VIÁVEL"},
};

const TIPO_ICON={
  "Rifle de Assalto":<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12h16"/><path d="M14 8h4l2 2v2l-2 2h-4"/><path d="M6 8v2"/><path d="M6 14v2"/><circle cx="5" cy="12" r="1.5"/><path d="M18 12v3l-2 2"/></svg>,
  "Submetralhadora":<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12h12"/><path d="M11 9h5l2 1.5v3L16 15h-5"/><path d="M8 9v6"/><circle cx="5" cy="12" r="1.5"/></svg>,
  "Franco-atirador":<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12h18"/><path d="M17 9h4l1 1.5v3L21 15h-4"/><circle cx="9" cy="12" r="2.5"/><path d="M9 9.5V7"/><path d="M9 14.5V17"/><path d="M3 10v4"/></svg>,
  "Metralhadora":<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12h18"/><path d="M15 8h5l2 2v4l-2 2h-5"/><path d="M5 10v4"/><path d="M9 10v4"/><circle cx="4" cy="12" r="1.5"/></svg>,
  "Rifle de Precisão":<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12h16"/><path d="M14 9h6l1 1.5v3L20 15h-6"/><circle cx="8" cy="12" r="2"/><path d="M4 10v4"/></svg>,
  "Escopeta":<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12h14"/><path d="M13 9h6a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-6"/><path d="M5 9v6"/><path d="M8 10v4"/></svg>,
  "Pistola":<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12h10"/><path d="M12 9h5l2 1.5V13l-2 1.5h-5"/><path d="M7 12v4l2 2"/></svg>,
  "Lançador":<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12h12"/><path d="M11 9h4l4 3-4 3h-4"/><circle cx="6" cy="12" r="2"/></svg>,
};
const DEFAULT_ICON=<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8l2-2h14l2 2v2H3V8z"/><rect x="3" y="10" width="18" height="4" rx="1"/><path d="M6 14v4"/><path d="M18 14v4"/></svg>;

export default function Meta(){
  const[weapons,setWeapons]=useState([]);
  const[loading,setLoading]=useState(true);
  const[filtro,setFiltro]=useState("Todos");
  const tipos=["Todos",...new Set(weapons.map(w=>w.tipo).filter(t=>Boolean(t)&&t!=="Desconhecido").sort())];

  useEffect(()=>{getMeta().then(d=>{setWeapons(d);setLoading(false)});},[]);

  const filtered=weapons
    .filter(w=>(filtro==="Todos"||w.tipo===filtro)&&w.tier!=="C"&&w.tipo!=="Desconhecido"&&Boolean(w.tipo))
    .sort((a,b)=>(TIER_ORDER[a.tier]??9)-(TIER_ORDER[b.tier]??9)||(b.pickRate-a.pickRate));

  const tiers=[...new Set(filtered.map(w=>w.tier))].sort((a,b)=>(TIER_ORDER[a]??9)-(TIER_ORDER[b]??9));

  return(
    <div style={{animation:"fadeIn .3s ease"}}>
      {/* Header */}
      <div style={{marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <span style={{fontSize:10,color:"#4ade80",fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>// INTELIGÊNCIA</span>
        </div>
        <h1 style={{fontSize:22,fontWeight:900,color:"#ddeee4",letterSpacing:.5,textTransform:"uppercase"}}>Meta Atual</h1>
        <p style={{fontSize:11,color:"#3d5a46",fontWeight:600,letterSpacing:.5,marginTop:2}}>MELHORES ARMAS — PICK RATE & EFICIÊNCIA</p>
      </div>

      {/* Filtro tipo */}
      <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:4,marginBottom:20}}>
        {tipos.map(t=>(
          <button key={t} onClick={()=>setFiltro(t)} style={{
            padding:"5px 12px",borderRadius:3,border:"1px solid",whiteSpace:"nowrap",
            background:filtro===t?"#f97316":"rgba(255,255,255,.03)",
            borderColor:filtro===t?"#f97316":"rgba(60,90,70,.3)",
            color:filtro===t?"#fff":"#4a6a55",
            fontSize:11,fontWeight:700,cursor:"pointer",
            letterSpacing:.5,textTransform:"uppercase"
          }}>{t}</button>
        ))}
      </div>

      {loading?(
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {[1,2,3,4,5].map(i=><div key={i} style={{background:"rgba(255,255,255,.02)",borderRadius:6,padding:14,borderLeft:"3px solid rgba(60,90,70,.3)"}}>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <Skeleton h={40} w={40} radius={6}/>
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
                <Skeleton h={13} w="40%"/>
                <Skeleton h={10} w="25%"/>
              </div>
              <Skeleton h={22} w={34} radius={4}/>
            </div>
          </div>)}
        </div>
      ):(
        tiers.map(tier=>{
          const ts=TIER_STYLE[tier]||TIER_STYLE.B;
          return(
            <div key={tier} style={{marginBottom:24}}>
              {/* Tier Header */}
              <div style={{
                display:"flex",alignItems:"center",gap:10,marginBottom:10,
                padding:"6px 12px",
                background:`linear-gradient(90deg,${ts.bar}18,transparent)`,
                borderLeft:`3px solid ${ts.bar}`,
                borderRadius:"0 4px 4px 0"
              }}>
                <TierBadge tier={tier}/>
                <span style={{fontSize:11,color:ts.bar,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase"}}>{ts.label}</span>
                <span style={{marginLeft:"auto",fontSize:10,color:"#3d5a46",fontWeight:600}}>
                  {filtered.filter(w=>w.tier===tier).length} ARMAS
                </span>
              </div>
              {/* Cards */}
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {filtered.filter(w=>w.tier===tier).map((w,i)=>(
                  <div key={w.id||w.arma} style={{
                    background:"rgba(12,22,16,.6)",
                    border:`1px solid rgba(60,90,70,.2)`,
                    borderLeft:`3px solid ${ts.border}`,
                    borderRadius:6,padding:"10px 12px",
                    display:"flex",alignItems:"center",gap:10,
                    boxShadow:ts.glow,
                    animation:`fadeIn .3s ease ${i*.04}s both`
                  }}>
                    {/* Rank */}
                    <span style={{fontSize:10,color:"#2d4a38",fontWeight:800,minWidth:18,textAlign:"center",fontFamily:"monospace"}}>
                      {String(filtered.indexOf(w)+1).padStart(2,"0")}
                    </span>

                    {/* Ícone por tipo */}
                    <div style={{
                      width:38,height:38,borderRadius:5,
                      background:tier==="S"?"rgba(245,158,11,.1)":tier==="A"?"rgba(249,115,22,.08)":"rgba(74,222,128,.07)",
                      border:`1px solid ${ts.border}`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      flexShrink:0,
                      color:tier==="S"?"#f59e0b":tier==="A"?"#f97316":"#4ade80"
                    }}>
                      {TIPO_ICON[w.tipo]||DEFAULT_ICON}
                    </div>

                    {/* Info */}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:800,fontSize:13,color:"#ddeee4",letterSpacing:.3,textTransform:"uppercase"}}>{w.arma}</div>
                      <div style={{fontSize:10,color:"#3d5a46",marginTop:2,fontWeight:600,letterSpacing:.5}}>{w.tipo}</div>
                    </div>

                    {/* Pick rate + badge */}
                    <div style={{textAlign:"right",flexShrink:0}}>
                      {w.pickRate>0&&<div style={{fontSize:11,fontWeight:800,color:"#f97316",fontFamily:"monospace"}}>{w.pickRate.toFixed(1)}%</div>}
                      <TierBadge tier={w.tier} small/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {!loading&&filtered.length===0&&(
        <p style={{textAlign:"center",color:"#2d4a38",marginTop:40,fontSize:13,letterSpacing:1,textTransform:"uppercase"}}>// Nenhuma arma encontrada</p>
      )}
    </div>
  );
}
