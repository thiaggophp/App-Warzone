import{useState,useEffect}from"react";
import{getMeta}from"../db";
import TierBadge from"../components/TierBadge";
import Skeleton from"../components/Skeleton";

const TIER_ORDER={"S":0,"A":1,"B":2,"C":3};

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
      <div style={{marginBottom:16}}>
        <h1 style={{fontSize:22,fontWeight:800,color:"#f1f5f9",marginBottom:4}}>Meta Atual</h1>
        <p style={{fontSize:12,color:"#475569"}}>Melhores armas por pick rate e eficiência</p>
      </div>

      {/* Filtro tipo */}
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:20}}>
        {tipos.map(t=>(
          <button key={t} onClick={()=>setFiltro(t)} style={{
            padding:"6px 14px",borderRadius:20,border:"1px solid",whiteSpace:"nowrap",
            background:filtro===t?"#f97316":"rgba(255,255,255,.04)",
            borderColor:filtro===t?"#f97316":"rgba(255,255,255,.08)",
            color:filtro===t?"#fff":"#64748b",
            fontSize:12,fontWeight:600,cursor:"pointer"
          }}>{t}</button>
        ))}
      </div>

      {loading?(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[1,2,3,4,5].map(i=><div key={i} style={{background:"rgba(255,255,255,.03)",borderRadius:14,padding:16,border:"1px solid rgba(255,255,255,.06)"}}>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <Skeleton h={44} w={44} radius={10}/>
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
                <Skeleton h={14} w="40%"/>
                <Skeleton h={11} w="25%"/>
              </div>
              <Skeleton h={24} w={36} radius={6}/>
            </div>
          </div>)}
        </div>
      ):(
        tiers.map(tier=>(
          <div key={tier} style={{marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <TierBadge tier={tier}/>
              <span style={{fontSize:12,color:"#475569",fontWeight:600}}>
                {tier==="S"||tier==="Meta Absoluta"?"Tier S — Top Meta":
                 tier==="A"||tier==="Meta"?"Tier A — Meta Sólido":
                 tier==="B"||tier==="Aceitável"?"Tier B — Viável":"Tier C — Situacional"}
              </span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {filtered.filter(w=>w.tier===tier).map((w,i)=>(
                <div key={w.id||w.arma} style={{
                  background:"rgba(255,255,255,.03)",
                  border:"1px solid rgba(255,255,255,.07)",
                  borderRadius:14,padding:"12px 14px",
                  display:"flex",alignItems:"center",gap:12,
                  animation:`fadeIn .3s ease ${i*.05}s both`
                }}>
                  {/* Rank */}
                  <span style={{fontSize:11,color:"#334155",fontWeight:700,minWidth:20,textAlign:"center"}}>
                    #{filtered.indexOf(w)+1}
                  </span>

                  {/* Ícone */}
                  <div style={{
                    width:42,height:42,borderRadius:10,
                    background:"rgba(249,115,22,.08)",
                    border:"1px solid rgba(249,115,22,.15)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    flexShrink:0
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5">
                      <path d="M3 8l2-2h14l2 2v2H3V8z"/><rect x="3" y="10" width="18" height="4" rx="1"/>
                      <path d="M6 14v4"/><path d="M18 14v4"/>
                    </svg>
                  </div>

                  {/* Info */}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:14,color:"#f1f5f9"}}>{w.arma}</div>
                    <div style={{fontSize:11,color:"#475569",marginTop:2}}>{w.tipo}</div>
                  </div>

                  {/* Pick rate */}
                  <div style={{textAlign:"right",flexShrink:0}}>
                    {w.pickRate>0&&<div style={{fontSize:12,fontWeight:700,color:"#f97316"}}>{w.pickRate.toFixed(1)}%</div>}
                    <TierBadge tier={w.tier} small/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {!loading&&filtered.length===0&&(
        <p style={{textAlign:"center",color:"#334155",marginTop:40,fontSize:14}}>Nenhuma arma encontrada</p>
      )}
    </div>
  );
}
