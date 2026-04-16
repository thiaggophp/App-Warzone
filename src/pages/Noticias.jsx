import{useState,useEffect}from"react";
import{getNoticias}from"../db";
import Skeleton from"../components/Skeleton";

function tempoPassado(d){
  const diff=Date.now()-new Date(d).getTime();
  const h=Math.floor(diff/3600000);
  const dias=Math.floor(h/24);
  if(dias>0)return`${dias}d atrás`;
  if(h>0)return`${h}h atrás`;
  return"Agora";
}

const FONTE_COLORS={"warzoneloadout.games":"#f97316","charlieintel.com":"#22c55e","dexerto.com":"#3b82f6","default":"#64748b"};

export default function Noticias(){
  const[noticias,setNoticias]=useState([]);
  const[loading,setLoading]=useState(true);
  useEffect(()=>{getNoticias().then(d=>{setNoticias(d);setLoading(false)});},[]);

  return(
    <div style={{animation:"fadeIn .3s ease"}}>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,color:"#4ade80",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>// TRANSMISSÃO</div>
        <h1 style={{fontSize:22,fontWeight:900,color:"#ddeee4",letterSpacing:.5,textTransform:"uppercase"}}>Notícias</h1>
        <p style={{fontSize:11,color:"#3d5a46",fontWeight:600,letterSpacing:.5,marginTop:2}}>ÚLTIMAS NOVIDADES DO WARZONE</p>
      </div>

      {loading?(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[1,2,3,4].map(i=>(
            <div key={i} style={{background:"rgba(255,255,255,.03)",borderRadius:14,padding:14,border:"1px solid rgba(255,255,255,.06)"}}>
              <Skeleton h={15} w="90%" style={{marginBottom:8}}/>
              <Skeleton h={12} w="70%" style={{marginBottom:6}}/>
              <Skeleton h={11} w="40%"/>
            </div>
          ))}
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {noticias.map((n,i)=>{
            const corFonte=FONTE_COLORS[n.fonte]||FONTE_COLORS.default;
            return(
              <a key={n.id||i} href={n.url||n.link} target="_blank" rel="noopener noreferrer" style={{
                textDecoration:"none",display:"block",
                background:"rgba(12,22,16,.6)",
                border:"1px solid rgba(60,90,70,.2)",
                borderLeft:"3px solid rgba(249,115,22,.4)",
                borderRadius:6,padding:14,
                animation:`fadeIn .3s ease ${i*.06}s both`,
                transition:"background .2s,border-color .2s"
              }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(16,30,20,.8)";e.currentTarget.style.borderColor="rgba(249,115,22,.3)"}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(12,22,16,.6)";e.currentTarget.style.borderColor="rgba(60,90,70,.2)"}}>
                {/* Imagem */}
                {n.imagem&&(
                  <div style={{
                    width:"100%",height:160,borderRadius:10,overflow:"hidden",marginBottom:12,
                    background:"rgba(255,255,255,.05)"
                  }}>
                    <img src={n.imagem} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.parentNode.style.display="none"}/>
                  </div>
                )}

                <div style={{fontSize:14,fontWeight:700,color:"#ddeee4",lineHeight:1.4,marginBottom:6}}>
                  {n.titulo}
                </div>

                {n.resumo&&(
                  <p style={{fontSize:12,color:"#64748b",lineHeight:1.5,marginBottom:8,
                    display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"
                  }}>{n.resumo}</p>
                )}

                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{
                    fontSize:10,fontWeight:600,
                    background:`${corFonte}1a`,color:corFonte,
                    border:`1px solid ${corFonte}33`,
                    borderRadius:20,padding:"2px 8px"
                  }}>{n.fonte}</span>
                  <span style={{fontSize:11,color:"#334155"}}>{tempoPassado(n.publicadoEm)}</span>
                </div>
              </a>
            );
          })}
        </div>
      )}

      {!loading&&noticias.length===0&&(
        <p style={{textAlign:"center",color:"#334155",marginTop:40,fontSize:14}}>Nenhuma notícia disponível</p>
      )}
    </div>
  );
}
