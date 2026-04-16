import{useState,useEffect}from"react";
import{getSugestoes}from"../db";

const CATEGORIAS=["Todas","Agressivo","Versátil","Sniper","Ranked","Iniciante"];

const CAT_ICONS={
  "Agressivo":<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  "Sniper":<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/><line x1="3" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="21" y2="12"/></svg>,
  "Versátil":<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  "Ranked":<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  "Iniciante":<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
};

export default function Sugestoes(){
  const[filtro,setFiltro]=useState("Todas");
  const[expandido,setExpandido]=useState(null);
  const[sugestoes,setSugestoes]=useState([]);
  const[loading,setLoading]=useState(true);

  useEffect(()=>{getSugestoes().then(d=>{setSugestoes(d);setLoading(false)});},[]);

  const lista=sugestoes.filter(s=>filtro==="Todas"||s.categoria===filtro);

  return(
    <div style={{animation:"fadeIn .3s ease"}}>
      <div style={{marginBottom:16}}>
        <h1 style={{fontSize:22,fontWeight:800,color:"#f1f5f9",marginBottom:4}}>Sugestões</h1>
        <p style={{fontSize:12,color:"#475569"}}>Setups táticos por estilo de jogo — armas, perks e dicas</p>
      </div>

      {/* Filtro categoria */}
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:20}}>
        {CATEGORIAS.map(c=>(
          <button key={c} onClick={()=>setFiltro(c)} style={{
            padding:"6px 14px",borderRadius:20,border:"1px solid",whiteSpace:"nowrap",
            background:filtro===c?"#f97316":"rgba(255,255,255,.04)",
            borderColor:filtro===c?"#f97316":"rgba(255,255,255,.08)",
            color:filtro===c?"#fff":"#64748b",
            fontSize:12,fontWeight:600,cursor:"pointer"
          }}>{c}</button>
        ))}
      </div>

      {/* Banner meta auto-atualizado */}
      {!loading&&sugestoes.some(s=>s.autoAtualizado)&&(
        <div style={{
          display:"flex",alignItems:"center",gap:8,
          background:"rgba(34,197,94,.07)",border:"1px solid rgba(34,197,94,.15)",
          borderRadius:12,padding:"8px 12px",marginBottom:16
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
            <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          <span style={{fontSize:11,color:"#22c55e",fontWeight:700}}>Armas sincronizadas com o meta atual</span>
        </div>
      )}

      {loading?(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[1,2,3].map(i=>(
            <div key={i} style={{background:"rgba(255,255,255,.03)",borderRadius:16,overflow:"hidden",border:"1px solid rgba(255,255,255,.07)"}}>
              <div style={{height:3,background:"rgba(255,255,255,.05)"}}/>
              <div style={{padding:"14px 16px",display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:40,height:40,borderRadius:10,background:"rgba(255,255,255,.06)"}}/>
                <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
                  <div style={{height:14,width:"50%",borderRadius:6,background:"rgba(255,255,255,.06)"}}/>
                  <div style={{height:10,width:"35%",borderRadius:6,background:"rgba(255,255,255,.04)"}}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      ):(
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {lista.map((s,i)=>{
          const open=expandido===s.id;
          return(
            <div key={s.id} style={{
              background:"rgba(255,255,255,.03)",
              border:`1px solid ${open?s.cor+"44":"rgba(255,255,255,.07)"}`,
              borderRadius:16,overflow:"hidden",
              animation:`fadeIn .3s ease ${i*.07}s both`,
              transition:"border-color .2s"
            }}>
              {/* Barra colorida topo */}
              <div style={{height:3,background:`linear-gradient(90deg,${s.cor},${s.cor}44)`}}/>

              {/* Header clicável */}
              <button onClick={()=>setExpandido(open?null:s.id)} style={{
                width:"100%",padding:"14px 16px",background:"none",border:"none",
                cursor:"pointer",display:"flex",alignItems:"center",gap:12,textAlign:"left"
              }}>
                {/* Badge categoria */}
                <div style={{
                  width:40,height:40,borderRadius:10,flexShrink:0,
                  background:`${s.cor}18`,border:`1px solid ${s.cor}33`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  color:s.cor
                }}>
                  {CAT_ICONS[s.categoria]||CAT_ICONS["Versátil"]}
                </div>

                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:800,fontSize:15,color:"#f1f5f9"}}>{s.titulo}</div>
                  <div style={{fontSize:11,color:"#475569",marginTop:2,display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                    <span style={{
                      background:`${s.cor}18`,color:s.cor,border:`1px solid ${s.cor}33`,
                      borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:700
                    }}>{s.categoria}</span>
                    <span>{s.subtitulo}</span>
                  </div>
                </div>

                {/* Arma principal + tier badge */}
                <div style={{textAlign:"right",flexShrink:0,marginRight:4}}>
                  <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end"}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#f97316"}}>{s.arma}</div>
                    {s.tierPrincipal&&<span style={{
                      fontSize:9,fontWeight:800,padding:"1px 5px",borderRadius:4,
                      background:s.tierPrincipal==="S"?"rgba(251,191,36,.15)":s.tierPrincipal==="A"?"rgba(249,115,22,.15)":"rgba(100,116,139,.15)",
                      color:s.tierPrincipal==="S"?"#fbbf24":s.tierPrincipal==="A"?"#f97316":"#64748b"
                    }}>{s.tierPrincipal}</span>}
                    {s.autoAtualizado&&<span title="Sincronizado com o meta atual" style={{color:"#22c55e",fontSize:10}}>↻</span>}
                  </div>
                  <div style={{fontSize:9,color:"#334155"}}>{s.tipoArma}</div>
                </div>

                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"
                  style={{transform:open?"rotate(180deg)":"rotate(0)",transition:"transform .2s",flexShrink:0}}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {/* Conteúdo expandido */}
              {open&&(
                <div style={{padding:"0 16px 18px",animation:"fadeIn .2s ease"}}>
                  <div style={{height:1,background:"rgba(255,255,255,.06)",marginBottom:14}}/>

                  {/* Armas */}
                  <div style={{marginBottom:14}}>
                    <div style={{fontSize:11,color:s.cor,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Armas</div>
                    <div style={{display:"flex",gap:8}}>
                      <div style={{flex:1,background:"rgba(255,255,255,.04)",borderRadius:10,padding:"10px 12px",border:`1px solid ${s.cor}22`}}>
                        <div style={{fontSize:9,color:"#475569",textTransform:"uppercase",letterSpacing:.5,fontWeight:600,marginBottom:3}}>Principal</div>
                        <div style={{fontSize:14,fontWeight:800,color:"#f1f5f9"}}>{s.arma}</div>
                        <div style={{fontSize:10,color:"#64748b",marginTop:1}}>{s.tipoArma}</div>
                      </div>
                      {s.armaSec&&(
                        <div style={{flex:1,background:"rgba(255,255,255,.04)",borderRadius:10,padding:"10px 12px"}}>
                          <div style={{fontSize:9,color:"#475569",textTransform:"uppercase",letterSpacing:.5,fontWeight:600,marginBottom:3}}>Secundária</div>
                          <div style={{fontSize:14,fontWeight:800,color:"#f1f5f9"}}>{s.armaSec}</div>
                          <div style={{fontSize:10,color:"#64748b",marginTop:1}}>{s.tipoArmaSec}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dicas */}
                  <div style={{
                    background:`${s.cor}08`,border:`1px solid ${s.cor}20`,
                    borderRadius:12,padding:"12px 14px"
                  }}>
                    <div style={{fontSize:11,color:s.cor,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>
                      Dicas Táticas
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {s.dicas.map((d,idx)=>(
                        <div key={idx} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                          <span style={{
                            width:18,height:18,borderRadius:"50%",
                            background:`${s.cor}20`,color:s.cor,
                            fontSize:9,fontWeight:800,flexShrink:0,
                            display:"flex",alignItems:"center",justifyContent:"center",
                            marginTop:1
                          }}>{idx+1}</span>
                          <span style={{fontSize:12,color:"#94a3b8",lineHeight:1.55}}>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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
