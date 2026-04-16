import{useState,useEffect}from"react";
import{getPatches}from"../db";

const MESES=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

function formatData(iso){
  const d=new Date(iso+"T12:00:00");
  return`${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

function NerfBuff({tipo}){
  const isNerf=tipo==="nerf";
  return(
    <span style={{
      fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:20,
      background:isNerf?"rgba(239,68,68,.15)":"rgba(34,197,94,.15)",
      color:isNerf?"#ef4444":"#22c55e",
      border:`1px solid ${isNerf?"rgba(239,68,68,.3)":"rgba(34,197,94,.3)"}`,
      letterSpacing:.5,textTransform:"uppercase"
    }}>{isNerf?"Nerf":"Buff"}</span>
  );
}

export default function Patches(){
  const[patches,setPatches]=useState([]);
  const[loading,setLoading]=useState(true);
  const[filtro,setFiltro]=useState("Todos");

  useEffect(()=>{getPatches().then(d=>{setPatches(d);setLoading(false)});},[]);

  const lista=filtro==="Todos"?patches:patches.filter(p=>p.tipo===filtro);

  // Agrupa por data
  const grupos=[];
  const seen=new Map();
  for(const p of lista){
    if(!seen.has(p.data)){
      seen.set(p.data,{data:p.data,temporada:p.temporada,items:[]});
      grupos.push(seen.get(p.data));
    }
    seen.get(p.data).items.push(p);
  }

  return(
    <div style={{animation:"fadeIn .3s ease"}}>
      <div style={{marginBottom:16}}>
        <h1 style={{fontSize:22,fontWeight:800,color:"#f1f5f9",marginBottom:4}}>Patches</h1>
        <p style={{fontSize:12,color:"#475569"}}>Nerfs e buffs recentes — warzoneloadout.games</p>
      </div>

      {/* Filtro */}
      <div style={{display:"flex",gap:6,marginBottom:20}}>
        {["Todos","nerf","buff"].map(f=>(
          <button key={f} onClick={()=>setFiltro(f)} style={{
            padding:"6px 16px",borderRadius:20,border:"1px solid",
            background:filtro===f?(f==="nerf"?"#ef4444":f==="buff"?"#22c55e":"#f97316"):"rgba(255,255,255,.04)",
            borderColor:filtro===f?(f==="nerf"?"#ef4444":f==="buff"?"#22c55e":"#f97316"):"rgba(255,255,255,.08)",
            color:filtro===f?"#fff":"#64748b",
            fontSize:12,fontWeight:700,cursor:"pointer",textTransform:"capitalize"
          }}>{f==="nerf"?"Nerfs":f==="buff"?"Buffs":"Todos"}</button>
        ))}
      </div>

      {loading?(
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {[1,2].map(i=>(
            <div key={i} style={{background:"rgba(255,255,255,.03)",borderRadius:14,padding:16,border:"1px solid rgba(255,255,255,.07)"}}>
              <div style={{height:12,width:"40%",borderRadius:6,background:"rgba(255,255,255,.07)",marginBottom:12}}/>
              {[1,2,3].map(j=>(
                <div key={j} style={{height:44,borderRadius:10,background:"rgba(255,255,255,.05)",marginBottom:6}}/>
              ))}
            </div>
          ))}
        </div>
      ):(
        grupos.length===0?(
          <p style={{textAlign:"center",color:"#334155",marginTop:40,fontSize:14}}>Nenhum patch encontrado</p>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {grupos.map((g,gi)=>(
              <div key={g.data} style={{animation:`fadeIn .3s ease ${gi*.05}s both`}}>
                {/* Header do grupo */}
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <div style={{
                    background:"rgba(249,115,22,.1)",border:"1px solid rgba(249,115,22,.2)",
                    borderRadius:8,padding:"4px 10px"
                  }}>
                    <span style={{fontSize:11,fontWeight:800,color:"#f97316"}}>{formatData(g.data)}</span>
                  </div>
                  <span style={{fontSize:10,color:"#475569",fontWeight:600}}>{g.temporada}</span>
                  <div style={{flex:1,height:1,background:"rgba(255,255,255,.06)"}}/>
                  <span style={{fontSize:10,color:"#334155"}}>
                    {g.items.filter(i=>i.tipo==="nerf").length>0&&
                      <span style={{color:"#ef4444",fontWeight:700}}>{g.items.filter(i=>i.tipo==="nerf").length} nerfs </span>}
                    {g.items.filter(i=>i.tipo==="buff").length>0&&
                      <span style={{color:"#22c55e",fontWeight:700}}>{g.items.filter(i=>i.tipo==="buff").length} buffs</span>}
                  </span>
                </div>

                {/* Lista de armas */}
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  {g.items.map((p,pi)=>{
                    const isNerf=p.tipo==="nerf";
                    return(
                      <a key={pi} href={p.link||"#"} target="_blank" rel="noopener noreferrer"
                        style={{textDecoration:"none"}}
                        onClick={e=>{if(!p.link||p.link==="#")e.preventDefault()}}
                      >
                        <div style={{
                          display:"flex",alignItems:"center",gap:10,
                          background:`rgba(255,255,255,.03)`,
                          border:`1px solid ${isNerf?"rgba(239,68,68,.12)":"rgba(34,197,94,.12)"}`,
                          borderLeft:`3px solid ${isNerf?"#ef4444":"#22c55e"}`,
                          borderRadius:10,padding:"10px 12px",
                          transition:"background .15s"
                        }}>
                          {/* Imagem da arma */}
                          {p.imagem?(
                            <img src={p.imagem} alt={p.arma} style={{
                              width:48,height:24,objectFit:"contain",flexShrink:0,
                              filter:"brightness(.9)"
                            }}/>
                          ):(
                            <div style={{
                              width:36,height:36,borderRadius:8,flexShrink:0,
                              background:isNerf?"rgba(239,68,68,.1)":"rgba(34,197,94,.1)",
                              display:"flex",alignItems:"center",justifyContent:"center"
                            }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke={isNerf?"#ef4444":"#22c55e"} strokeWidth="1.5">
                                <path d="M3 8l2-2h14l2 2v2H3V8z"/><rect x="3" y="10" width="18" height="4" rx="1"/>
                                <path d="M6 14v4"/><path d="M18 14v4"/>
                              </svg>
                            </div>
                          )}

                          <span style={{flex:1,fontSize:14,fontWeight:700,color:"#f1f5f9"}}>{p.arma}</span>

                          <NerfBuff tipo={p.tipo}/>

                          {p.link&&(
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                              stroke="#334155" strokeWidth="2" style={{flexShrink:0}}>
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                          )}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
