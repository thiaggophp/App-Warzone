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

const TWITTER=[
  {handle:"RavenSoftware",desc:"Desenvolvedora do Warzone",url:"https://x.com/RavenSoftware"},
  {handle:"CODUpdates",desc:"Atualizações em tempo real",url:"https://x.com/CODUpdates"},
  {handle:"CallofDuty",desc:"Canal oficial Call of Duty",url:"https://x.com/CallofDuty"},
];

const YOUTUBE=[
  {nome:"NGVieira",url:"https://www.youtube.com/@NGVieira"},
  {nome:"NinexT",url:"https://www.youtube.com/@NinexT"},
  {nome:"Airinho Joga",url:"https://www.youtube.com/@AirinhoJoga"},
  {nome:"Hayashii",url:"https://www.youtube.com/@Hayashii"},
];

function LinkCard({href,children}){
  return(
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      textDecoration:"none",display:"block",
      background:"rgba(12,22,16,.6)",
      border:"1px solid rgba(60,90,70,.2)",
      borderLeft:"3px solid rgba(74,222,128,.3)",
      borderRadius:6,padding:"10px 12px",
      transition:"background .15s,border-color .15s"
    }}
    onMouseEnter={e=>{e.currentTarget.style.background="rgba(16,30,20,.9)";e.currentTarget.style.borderLeftColor="rgba(74,222,128,.6)"}}
    onMouseLeave={e=>{e.currentTarget.style.background="rgba(12,22,16,.6)";e.currentTarget.style.borderLeftColor="rgba(74,222,128,.3)"}}>
      {children}
    </a>
  );
}

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
                {n.imagem&&(
                  <div style={{width:"100%",height:160,borderRadius:10,overflow:"hidden",marginBottom:12,background:"rgba(255,255,255,.05)"}}>
                    <img src={n.imagem} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.parentNode.style.display="none"}/>
                  </div>
                )}
                <div style={{fontSize:14,fontWeight:700,color:"#ddeee4",lineHeight:1.4,marginBottom:6}}>{n.titulo}</div>
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

      {/* Seção Acompanhe */}
      <div style={{marginTop:32}}>
        <div style={{fontSize:10,color:"#4ade80",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:16}}>// ACOMPANHE</div>

        {/* Twitter / X */}
        <div style={{marginBottom:16}}>
          <div style={{
            display:"flex",alignItems:"center",gap:6,marginBottom:8
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#94a3b8">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span style={{fontSize:11,color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:.8}}>Twitter / X</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {TWITTER.map(t=>(
              <LinkCard key={t.handle} href={t.url}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{
                    width:30,height:30,borderRadius:6,flexShrink:0,
                    background:"rgba(255,255,255,.06)",
                    display:"flex",alignItems:"center",justifyContent:"center"
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#94a3b8">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#ddeee4"}}>@{t.handle}</div>
                    <div style={{fontSize:11,color:"#475569"}}>{t.desc}</div>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" style={{flexShrink:0}}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </div>
              </LinkCard>
            ))}
          </div>
        </div>

        {/* Blog Oficial */}
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span style={{fontSize:11,color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:.8}}>Blog Oficial</span>
          </div>
          <LinkCard href="https://www.callofduty.com/br/pt/warzone">
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{
                width:30,height:30,borderRadius:6,flexShrink:0,
                background:"rgba(249,115,22,.1)",border:"1px solid rgba(249,115,22,.2)",
                display:"flex",alignItems:"center",justifyContent:"center"
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:"#ddeee4"}}>callofduty.com/warzone</div>
                <div style={{fontSize:11,color:"#475569"}}>Site oficial — novidades e patches</div>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" style={{flexShrink:0}}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </div>
          </LinkCard>
        </div>

        {/* YouTube BR */}
        <div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#94a3b8">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
              <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#080c0a"/>
            </svg>
            <span style={{fontSize:11,color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:.8}}>YouTube BR</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            {YOUTUBE.map(y=>(
              <a key={y.nome} href={y.url} target="_blank" rel="noopener noreferrer" style={{
                textDecoration:"none",
                background:"rgba(12,22,16,.6)",
                border:"1px solid rgba(60,90,70,.2)",
                borderLeft:"3px solid rgba(239,68,68,.3)",
                borderRadius:6,padding:"10px 12px",
                display:"flex",alignItems:"center",gap:8,
                transition:"background .15s"
              }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(16,30,20,.9)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(12,22,16,.6)"}>
                <div style={{
                  width:28,height:28,borderRadius:6,flexShrink:0,
                  background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.2)",
                  display:"flex",alignItems:"center",justifyContent:"center"
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#ef4444">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#1a0808"/>
                  </svg>
                </div>
                <span style={{fontSize:12,fontWeight:700,color:"#ddeee4",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{y.nome}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
