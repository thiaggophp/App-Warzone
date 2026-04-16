import{useState,useEffect}from"react";
import{getTemporada}from"../db";
import Skeleton from"../components/Skeleton";

function calcProgress(inicio,fim){
  const now=Date.now();
  const s=new Date(inicio).getTime();
  const e=new Date(fim).getTime();
  return Math.min(100,Math.max(0,((now-s)/(e-s))*100));
}
function diasRestantes(fim){return Math.max(0,Math.ceil((new Date(fim)-new Date())/(1000*60*60*24)))}
function formatData(d){return new Date(d).toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"})}

export default function Temporada(){
  const[data,setData]=useState(null);
  const[loading,setLoading]=useState(true);
  useEffect(()=>{getTemporada().then(d=>{setData(d);setLoading(false)});},[]);

  if(loading)return(
    <div style={{animation:"fadeIn .3s ease"}}>
      <Skeleton h={28} w="60%" style={{marginBottom:8}}/>
      <Skeleton h={14} w="40%" style={{marginBottom:24}}/>
      <Skeleton h={100} radius={16} style={{marginBottom:16}}/>
      <Skeleton h={200} radius={16}/>
    </div>
  );

  if(!data)return<p style={{textAlign:"center",color:"#334155",marginTop:60}}>Dados da temporada indisponíveis</p>;

  const novidades=Array.isArray(data.novidades)?data.novidades:(typeof data.novidades==="string"?JSON.parse(data.novidades||"[]"):[]);
  const progress=calcProgress(data.inicio,data.fim);
  const dias=diasRestantes(data.fim);

  return(
    <div style={{animation:"fadeIn .3s ease"}}>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,color:"#4ade80",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>// STATUS OPERACIONAL</div>
        <h1 style={{fontSize:22,fontWeight:900,color:"#ddeee4",letterSpacing:.5,textTransform:"uppercase"}}>{data.numero}</h1>
        <p style={{fontSize:11,color:"#3d5a46",fontWeight:600,letterSpacing:.5,marginTop:2,textTransform:"uppercase"}}>{data.jogo||"Warzone"}</p>
      </div>

      {/* Card progresso */}
      <div style={{
        background:"rgba(12,22,16,.7)",
        border:"1px solid rgba(249,115,22,.25)",
        borderLeft:"3px solid #f97316",
        borderRadius:6,padding:16,marginBottom:14
      }}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{fontSize:10,fontWeight:800,color:"#f97316",letterSpacing:1.5,textTransform:"uppercase"}}>// PROGRESSO DA TEMPORADA</span>
          <span style={{
            background:"rgba(249,115,22,.15)",border:"1px solid rgba(249,115,22,.3)",
            borderRadius:3,padding:"3px 10px",fontSize:11,fontWeight:800,color:"#f97316",
            letterSpacing:.5,textTransform:"uppercase",fontFamily:"monospace"
          }}>{dias}d restantes</span>
        </div>

        {/* Barra estilo HUD */}
        <div style={{background:"rgba(255,255,255,.06)",borderRadius:2,height:6,marginBottom:8,overflow:"hidden",position:"relative"}}>
          <div style={{
            height:"100%",borderRadius:2,
            background:"linear-gradient(90deg,#f97316,#f59e0b)",
            width:`${progress.toFixed(1)}%`,transition:"width 1s ease",
            boxShadow:"0 0 8px rgba(249,115,22,.5)"
          }}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#3d5a46",fontFamily:"monospace",fontWeight:700}}>
          <span>{formatData(data.inicio)}</span>
          <span style={{color:"#f97316",fontSize:11}}>{progress.toFixed(0)}%</span>
          <span>{formatData(data.fim)}</span>
        </div>
      </div>

      {/* Descrição */}
      <div style={{
        background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",
        borderRadius:14,padding:14,marginBottom:14
      }}>
        <p style={{fontSize:13,color:"#94a3b8",lineHeight:1.6}}>{data.descricao}</p>
      </div>

      {/* Novidades */}
      {novidades.length>0&&(
        <div style={{
          background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",
          borderRadius:14,padding:14,marginBottom:14
        }}>
          <div style={{fontSize:11,color:"#f97316",fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:12}}>Novidades da Temporada</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {novidades.map((n,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <span style={{color:"#f97316",fontSize:14,marginTop:1,flexShrink:0}}>▸</span>
                <span style={{fontSize:13,color:"#cbd5e1",lineHeight:1.5}}>{n}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Passe de batalha */}
      {data.passeDeBatalha&&(
        <div style={{
          background:"linear-gradient(135deg,rgba(168,85,247,.1),rgba(99,102,241,.05))",
          border:"1px solid rgba(168,85,247,.2)",borderRadius:14,padding:14
        }}>
          <div style={{fontSize:11,color:"#c084fc",fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Passe de Batalha</div>
          <div style={{display:"flex",gap:8}}>
            <div style={{flex:1,textAlign:"center",background:"rgba(255,255,255,.04)",borderRadius:10,padding:10}}>
              <div style={{fontSize:22,fontWeight:800,color:"#c084fc"}}>{data.passeDeBatalha.itens}</div>
              <div style={{fontSize:10,color:"#64748b"}}>Itens</div>
            </div>
            <div style={{flex:2,background:"rgba(255,255,255,.04)",borderRadius:10,padding:10}}>
              <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",marginBottom:4}}>{data.passeDeBatalha.destaque}</div>
              <div style={{fontSize:11,color:"#475569"}}>Por {data.passeDeBatalha.preco}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
