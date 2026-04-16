import{useState,useEffect}from"react";
import{getLoadouts}from"../db";
import TierBadge from"../components/TierBadge";
import Skeleton from"../components/Skeleton";

const FILTROS=["Todos","S","A","B"];
const SLOT_ICONS={"Boca":"💨","Cano":"🔩","Acoplamento":"🔧","Mira":"🔭","Cabo":"✋","Munição":"📦","Coronha":"🪵","Cabo de pistola":"🤜","Receptor":"⚙️"};

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
        <h1 style={{fontSize:22,fontWeight:800,color:"#f1f5f9",marginBottom:4}}>Loadouts</h1>
        <p style={{fontSize:12,color:"#475569"}}>Configurações completas com attachments e perks</p>
      </div>

      <div style={{display:"flex",gap:6,marginBottom:20}}>
        {FILTROS.map(f=>(
          <button key={f} onClick={()=>setFiltro(f)} style={{
            padding:"6px 16px",borderRadius:20,border:"1px solid",
            background:filtro===f?"#f97316":"rgba(255,255,255,.04)",
            borderColor:filtro===f?"#f97316":"rgba(255,255,255,.08)",
            color:filtro===f?"#fff":"#64748b",
            fontSize:12,fontWeight:600,cursor:"pointer"
          }}>
            {f==="Todos"?"Todos":"Tier "+f}
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
                background:"rgba(255,255,255,.03)",
                border:`1px solid ${open?"rgba(249,115,22,.3)":"rgba(255,255,255,.07)"}`,
                borderRadius:16,overflow:"hidden",
                animation:`fadeIn .3s ease ${i*.06}s both`,
                transition:"border-color .2s"
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
                    <div style={{fontWeight:700,fontSize:15,color:"#f1f5f9"}}>{l.arma}</div>
                    <div style={{fontSize:11,color:"#475569",marginTop:2,display:"flex",gap:6,alignItems:"center"}}>
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
                      <div style={{fontSize:11,color:"#f97316",fontWeight:700,marginBottom:8,letterSpacing:.8,textTransform:"uppercase"}}>Attachments</div>
                      <div style={{display:"flex",flexDirection:"column",gap:6}}>
                        {atts.map((a,idx)=>(
                          <div key={idx} style={{
                            display:"flex",alignItems:"center",gap:10,
                            background:"rgba(255,255,255,.03)",borderRadius:8,padding:"8px 12px"
                          }}>
                            <span style={{fontSize:16}}>{SLOT_ICONS[a.slot]||"🔸"}</span>
                            <div>
                              <div style={{fontSize:10,color:"#475569",fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>{a.slot}</div>
                              <div style={{fontSize:13,color:"#e2e8f0",fontWeight:600}}>{a.nome}</div>
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
                        background:"rgba(249,115,22,.06)",border:"1px solid rgba(249,115,22,.15)",
                        borderRadius:8,padding:"10px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"
                      }}>
                        <div>
                          <div style={{fontSize:10,color:"#f97316",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Código do Loadout</div>
                          <div style={{fontSize:13,color:"#fed7aa",fontWeight:700,marginTop:2,fontFamily:"monospace"}}>{l.codigo}</div>
                        </div>
                        <button onClick={()=>navigator.clipboard?.writeText(l.codigo)} style={{
                          background:"rgba(249,115,22,.15)",border:"1px solid rgba(249,115,22,.25)",
                          borderRadius:6,padding:"5px 10px",color:"#f97316",fontSize:11,fontWeight:600,cursor:"pointer"
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
