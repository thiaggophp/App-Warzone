import{useState,useEffect}from"react";
import{getLoadouts}from"../db";
import TierBadge from"../components/TierBadge";
import Skeleton from"../components/Skeleton";

const FILTROS=["Todos","S","A","B"];
const SLOT_ICONS={"Boca":"💨","Cano":"🔩","Acoplamento":"🔧","Mira":"🔭","Cabo":"✋","Munição":"📦","Coronha":"🪵","Cabo de pistola":"🤜","Receptor":"⚙️"};
const TIER_BORDER={S:"rgba(245,158,11,.5)",A:"rgba(249,115,22,.4)",B:"rgba(74,222,128,.35)"};
const TIER_GLOW={S:"0 0 14px rgba(245,158,11,.12)",A:"none",B:"none"};

export default function Loadouts(){
  const[loadouts,setLoadouts]=useState([]);
  const[loading,setLoading]=useState(true);
  const[filtro,setFiltro]=useState("Todos");
  const[expandido,setExpandido]=useState(null);

  useEffect(()=>{getLoadouts().then(d=>{setLoadouts(d);setLoading(false)});},[]);

  const filtered=loadouts.filter(l=>filtro==="Todos"||l.tier===filtro||
    (filtro==="S"&&(l.tier==="S"||l.tier==="Meta Absoluta"))||
    (filtro==="A"&&(l.tier==="A"||l.tier==="Meta"))||
    (filtro==="B"&&(l.tier==="B"||l.tier==="Aceitável"))
  );

  return(
    <div style={{animation:"fadeIn .3s ease"}}>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:10,color:"#4ade80",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>// ARMAMENTO</div>
        <h1 style={{fontSize:22,fontWeight:900,color:"#ddeee4",letterSpacing:.5,textTransform:"uppercase"}}>Loadouts</h1>
        <p style={{fontSize:11,color:"#3d5a46",fontWeight:600,letterSpacing:.5,marginTop:2}}>CONFIGURAÇÕES COM ATTACHMENTS REAIS</p>
      </div>

      <div style={{display:"flex",gap:5,marginBottom:20}}>
        {FILTROS.map(f=>(
          <button key={f} onClick={()=>setFiltro(f)} style={{
            padding:"5px 14px",borderRadius:3,border:"1px solid",
            background:filtro===f?"#f97316":"rgba(255,255,255,.03)",
            borderColor:filtro===f?"#f97316":"rgba(60,90,70,.3)",
            color:filtro===f?"#fff":"#4a6a55",
            fontSize:11,fontWeight:700,cursor:"pointer",
            letterSpacing:.5,textTransform:"uppercase"
          }}>
            {f==="Todos"?"TODOS":"TIER "+f}
          </button>
        ))}
      </div>

      {loading?(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[1,2,3].map(i=><div key={i} style={{background:"rgba(255,255,255,.03)",borderRadius:16,padding:16,border:"1px solid rgba(255,255,255,.06)"}}>
            <div style={{display:"flex",gap:10,marginBottom:12}}><Skeleton h={44} w={44} radius={10}/><div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}><Skeleton h={15} w="50%"/><Skeleton h={11} w="30%"/></div></div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>{[1,2,3].map(j=><Skeleton key={j} h={36} radius={8}/>)}</div>
          </div>)}
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {filtered.map((l,i)=>{
            const uid=l.id||l.arma;
            const open=expandido===uid;
            const perks=Array.isArray(l.perks)?l.perks:(typeof l.perks==="string"?JSON.parse(l.perks||"[]"):[]);
            const atts=Array.isArray(l.attachments)?l.attachments:(typeof l.attachments==="string"?JSON.parse(l.attachments||"[]"):[]);
            return(
              <div key={l.id||l.arma} style={{
                background:"rgba(12,22,16,.6)",
                border:`1px solid ${open?TIER_BORDER[l.tier]||"rgba(249,115,22,.3)":"rgba(60,90,70,.2)"}`,
                borderLeft:`3px solid ${TIER_BORDER[l.tier]||"rgba(60,90,70,.3)"}`,
                borderRadius:6,overflow:"hidden",
                animation:`fadeIn .3s ease ${i*.06}s both`,
                boxShadow:open?TIER_GLOW[l.tier]||"none":"none",
                transition:"border-color .2s,box-shadow .2s"
              }}>
                {/* Header */}
                <button onClick={()=>setExpandido(open?null:uid)} style={{
                  width:"100%",padding:"14px 16px",background:"none",border:"none",
                  cursor:"pointer",display:"flex",alignItems:"center",gap:12,textAlign:"left"
                }}>
                  <div style={{
                    width:44,height:44,borderRadius:10,flexShrink:0,
                    background:"rgba(249,115,22,.1)",border:"1px solid rgba(249,115,22,.2)",
                    display:"flex",alignItems:"center",justifyContent:"center"
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5">
                      <path d="M3 8l2-2h14l2 2v2H3V8z"/><rect x="3" y="10" width="18" height="4" rx="1"/>
                      <path d="M6 14v4"/><path d="M18 14v4"/>
                    </svg>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:800,fontSize:14,color:"#ddeee4",letterSpacing:.3,textTransform:"uppercase"}}>{l.arma}</div>
                    <div style={{fontSize:10,color:"#3d5a46",marginTop:2,display:"flex",gap:6,alignItems:"center",fontWeight:600,letterSpacing:.5}}>
                      <span>{l.tipo}</span>
                      {l.alcance&&<><span>·</span><span>{l.alcance}</span></>}
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                    <TierBadge tier={l.tier} small/>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"
                      style={{transform:open?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s"}}>
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>
                </button>

                {/* Conteúdo expandido */}
                {open&&(
                  <div style={{padding:"0 16px 16px",animation:"fadeIn .2s ease"}}>
                    <div style={{height:1,background:"rgba(255,255,255,.06)",marginBottom:14}}/>

                    {/* Attachments */}
                    <div style={{marginBottom:14}}>
                      <div style={{fontSize:10,color:"#f97316",fontWeight:800,marginBottom:8,letterSpacing:1.5,textTransform:"uppercase"}}>// Attachments</div>
                      <div style={{display:"flex",flexDirection:"column",gap:4}}>
                        {atts.map((a,idx)=>(
                          <div key={idx} style={{
                            display:"flex",alignItems:"center",gap:10,
                            background:"rgba(255,255,255,.025)",borderRadius:4,padding:"7px 10px",
                            borderLeft:"2px solid rgba(60,90,70,.4)"
                          }}>
                            <span style={{fontSize:14}}>{SLOT_ICONS[a.slot]||"🔸"}</span>
                            <div>
                              <div style={{fontSize:9,color:"#2d4a38",fontWeight:700,textTransform:"uppercase",letterSpacing:.8}}>{a.slot}</div>
                              <div style={{fontSize:12,color:"#cfe8d8",fontWeight:700}}>{a.nome}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Perks */}
                    {perks.length>0&&(
                      <div style={{marginBottom:14}}>
                        <div style={{fontSize:11,color:"#f97316",fontWeight:700,marginBottom:8,letterSpacing:.8,textTransform:"uppercase"}}>Perks</div>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                          {perks.map((p,idx)=>(
                            <span key={idx} style={{
                              background:"rgba(168,85,247,.1)",border:"1px solid rgba(168,85,247,.2)",
                              color:"#c084fc",borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600
                            }}>{p}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Equipamentos */}
                    <div style={{display:"flex",gap:8,marginBottom:14}}>
                      {l.tatico&&<div style={{flex:1,background:"rgba(255,255,255,.03)",borderRadius:8,padding:"8px 10px"}}>
                        <div style={{fontSize:10,color:"#475569",fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:2}}>Tático</div>
                        <div style={{fontSize:13,color:"#e2e8f0",fontWeight:600}}>💠 {l.tatico}</div>
                      </div>}
                      {l.letal&&<div style={{flex:1,background:"rgba(255,255,255,.03)",borderRadius:8,padding:"8px 10px"}}>
                        <div style={{fontSize:10,color:"#475569",fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:2}}>Letal</div>
                        <div style={{fontSize:13,color:"#e2e8f0",fontWeight:600}}>💥 {l.letal}</div>
                      </div>}
                    </div>

                    {/* Código */}
                    {l.codigo&&(
                      <div style={{
                        background:"rgba(245,158,11,.05)",border:"1px solid rgba(245,158,11,.2)",
                        borderRadius:4,padding:"10px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"
                      }}>
                        <div>
                          <div style={{fontSize:9,color:"#f59e0b",fontWeight:800,textTransform:"uppercase",letterSpacing:1.2}}>// CÓDIGO DO LOADOUT</div>
                          <div style={{fontSize:12,color:"#fde68a",fontWeight:700,marginTop:3,fontFamily:"monospace",letterSpacing:.5}}>{l.codigo}</div>
                        </div>
                        <button onClick={()=>navigator.clipboard?.writeText(l.codigo)} style={{
                          background:"rgba(245,158,11,.12)",border:"1px solid rgba(245,158,11,.3)",
                          borderRadius:3,padding:"5px 10px",color:"#f59e0b",fontSize:10,fontWeight:800,cursor:"pointer",
                          letterSpacing:.5,textTransform:"uppercase"
                        }}>Copiar</button>
                      </div>
                    )}

                    {l.fonte&&<div style={{fontSize:10,color:"#334155",marginTop:10}}>Fonte: {l.fonte}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
