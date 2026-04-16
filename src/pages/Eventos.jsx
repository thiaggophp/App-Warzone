import{useState,useEffect}from"react";
import{getEventos}from"../db";
import Skeleton from"../components/Skeleton";

function diasRestantes(fim){
  const d=Math.ceil((new Date(fim)-new Date())/(1000*60*60*24));
  return d>0?d:0;
}
function formatData(d){return new Date(d).toLocaleDateString("pt-BR",{day:"2-digit",month:"short"})}

export default function Eventos(){
  const[eventos,setEventos]=useState([]);
  const[loading,setLoading]=useState(true);
  useEffect(()=>{getEventos().then(d=>{setEventos(d);setLoading(false)});},[]);

  const ativos=eventos.filter(e=>e.ativo!==false&&diasRestantes(e.fim)>0);
  const proximos=eventos.filter(e=>e.ativo===false&&new Date(e.inicio)>new Date());

  const TIPO_ICON={skin:"👤",arma:"🔫",emblema:"🏅",xp:"⭐",cosmético:"🎨",ranked:"🏆"};

  return(
    <div style={{animation:"fadeIn .3s ease"}}>
      <div style={{marginBottom:20}}>
        <h1 style={{fontSize:22,fontWeight:800,color:"#f1f5f9",marginBottom:4}}>Eventos</h1>
        <p style={{fontSize:12,color:"#475569"}}>Eventos ativos e próximos com recompensas</p>
      </div>

      {loading?(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[1,2,3].map(i=><div key={i} style={{background:"rgba(255,255,255,.03)",borderRadius:16,padding:16,border:"1px solid rgba(255,255,255,.06)"}}>
            <Skeleton h={18} w="60%" style={{marginBottom:10}}/>
            <Skeleton h={12} w="80%" style={{marginBottom:8}}/>
            <div style={{display:"flex",gap:6}}>{[1,2].map(j=><Skeleton key={j} h={28} w={120} radius={20}/>)}</div>
          </div>)}
        </div>
      ):(
        <>
          {ativos.length>0&&(
            <div style={{marginBottom:28}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <span style={{width:8,height:8,borderRadius:"50%",background:"#22c55e",display:"inline-block",boxShadow:"0 0 8px #22c55e"}}/>
                <span style={{fontSize:11,color:"#22c55e",fontWeight:700,textTransform:"uppercase",letterSpacing:.8}}>Ativos Agora</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {ativos.map((e,i)=>{
                  const dias=diasRestantes(e.fim);
                  const recompensas=Array.isArray(e.recompensas)?e.recompensas:(typeof e.recompensas==="string"?JSON.parse(e.recompensas||"[]"):[]);
                  return(
                    <div key={e.id} style={{
                      background:"rgba(255,255,255,.03)",
                      border:`1px solid ${e.cor||"#f97316"}33`,
                      borderRadius:16,overflow:"hidden",
                      animation:`fadeIn .3s ease ${i*.08}s both`
                    }}>
                      {/* Barra colorida no topo */}
                      <div style={{height:3,background:e.cor||"#f97316"}}/>
                      <div style={{padding:16}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                          <div style={{fontSize:16,fontWeight:700,color:"#f1f5f9",flex:1,paddingRight:8}}>{e.nome}</div>
                          <div style={{
                            background:dias<=3?"rgba(239,68,68,.15)":"rgba(34,197,94,.1)",
                            border:`1px solid ${dias<=3?"rgba(239,68,68,.3)":"rgba(34,197,94,.25)"}`,
                            borderRadius:20,padding:"3px 10px",flexShrink:0
                          }}>
                            <span style={{fontSize:11,fontWeight:700,color:dias<=3?"#ef4444":"#22c55e"}}>
                              {dias===0?"Último dia":`${dias} dias`}
                            </span>
                          </div>
                        </div>
                        <p style={{fontSize:12,color:"#64748b",marginBottom:12,lineHeight:1.5}}>{e.descricao}</p>

                        {/* Datas */}
                        <div style={{fontSize:11,color:"#475569",marginBottom:12}}>
                          📅 {formatData(e.inicio)} → {formatData(e.fim)}
                        </div>

                        {/* Recompensas */}
                        {recompensas.length>0&&(
                          <div>
                            <div style={{fontSize:10,color:e.cor||"#f97316",fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Recompensas</div>
                            <div style={{display:"flex",flexDirection:"column",gap:5}}>
                              {recompensas.map((r,idx)=>(
                                <div key={idx} style={{
                                  display:"flex",alignItems:"center",gap:8,
                                  background:"rgba(255,255,255,.03)",borderRadius:8,padding:"6px 10px"
                                }}>
                                  <span style={{fontSize:14}}>{TIPO_ICON[r.tipo]||"🎁"}</span>
                                  <span style={{fontSize:12,color:"#e2e8f0"}}>{r.nome}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {proximos.length>0&&(
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <span style={{width:8,height:8,borderRadius:"50%",background:"#475569",display:"inline-block"}}/>
                <span style={{fontSize:11,color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:.8}}>Em Breve</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {proximos.map((e,i)=>(
                  <div key={e.id} style={{
                    background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",
                    borderRadius:12,padding:"12px 14px",
                    animation:`fadeIn .3s ease ${i*.08}s both`
                  }}>
                    <div style={{fontWeight:600,fontSize:14,color:"#64748b"}}>{e.nome}</div>
                    <div style={{fontSize:11,color:"#334155",marginTop:2}}>Começa em {formatData(e.inicio)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {ativos.length===0&&proximos.length===0&&(
            <p style={{textAlign:"center",color:"#334155",marginTop:40,fontSize:14}}>Nenhum evento disponível no momento</p>
          )}
        </>
      )}
    </div>
  );
}
