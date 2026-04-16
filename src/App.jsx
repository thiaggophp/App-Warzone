import{useState}from"react";
import BottomNav from"./components/BottomNav";
import Meta from"./pages/Meta";
import Loadouts from"./pages/Loadouts";
import Sugestoes from"./pages/Sugestoes";
import Eventos from"./pages/Eventos";
import Temporada from"./pages/Temporada";
import Noticias from"./pages/Noticias";
import Patches from"./pages/Patches";

const PAGES={meta:Meta,loadouts:Loadouts,sugestoes:Sugestoes,eventos:Eventos,temporada:Temporada,noticias:Noticias,patches:Patches};

const HEADER={
  meta:{title:"Meta",sub:"Tier list — Black Ops 7"},
  loadouts:{title:"Loadouts",sub:"Builds completas — BO7"},
  sugestoes:{title:"Sugestões",sub:"Setups por estilo de jogo"},
  eventos:{title:"Eventos",sub:"Recompensas ativas"},
  temporada:{title:"Temporada",sub:"Warzone × Black Ops 7"},
  noticias:{title:"Notícias",sub:"Warzone em destaque"},
  patches:{title:"Patches",sub:"Nerfs & Buffs recentes"},
};

const VERSION=typeof __APP_VERSION__!=="undefined"?__APP_VERSION__:"1.0.0";
const BUILD=typeof __BUILD_DATE__!=="undefined"?__BUILD_DATE__:"—";

function SobreModal({onClose}){
  return(
    <div
      onClick={onClose}
      style={{
        position:"fixed",inset:0,zIndex:100,
        background:"rgba(0,0,0,.7)",
        backdropFilter:"blur(6px)",
        display:"flex",alignItems:"flex-end",justifyContent:"center",
        padding:"0 0 0 0"
      }}
    >
      <div
        onClick={e=>e.stopPropagation()}
        style={{
          background:"#0f0f17",
          border:"1px solid rgba(255,255,255,.08)",
          borderRadius:"20px 20px 0 0",
          width:"100%",maxWidth:600,
          padding:"28px 24px 40px",
          animation:"slideUp .25s ease"
        }}
      >
        {/* Handle */}
        <div style={{width:40,height:4,background:"rgba(255,255,255,.15)",borderRadius:2,margin:"0 auto 24px"}}/>

        {/* Logo + nome */}
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
          <div style={{
            width:52,height:52,borderRadius:14,
            background:"linear-gradient(135deg,#f97316,#c2410c)",
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 0 24px rgba(249,115,22,.5)",flexShrink:0
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="2"/>
              <line x1="12" y1="3" x2="12" y2="7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="17" x2="12" y2="21" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="12" x2="7" y2="12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <line x1="17" y1="12" x2="21" y2="12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{fontSize:18,fontWeight:900,color:"#f1f5f9",letterSpacing:1,textTransform:"uppercase"}}>
              Warzone <span style={{color:"#f97316"}}>Recon</span>
            </div>
            <div style={{fontSize:12,color:"#f97316",fontWeight:700,marginTop:2}}>by Shark</div>
          </div>
        </div>

        {/* Versão */}
        <div style={{
          background:"rgba(249,115,22,.06)",border:"1px solid rgba(249,115,22,.15)",
          borderRadius:12,padding:"12px 16px",marginBottom:16,
          display:"flex",justifyContent:"space-between",alignItems:"center"
        }}>
          <div>
            <div style={{fontSize:11,color:"#475569",fontWeight:600,textTransform:"uppercase",letterSpacing:.6,marginBottom:2}}>Versão</div>
            <div style={{fontSize:20,fontWeight:800,color:"#f97316",fontFamily:"monospace"}}>v{VERSION}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:11,color:"#475569",fontWeight:600,textTransform:"uppercase",letterSpacing:.6,marginBottom:2}}>Build</div>
            <div style={{fontSize:13,color:"#94a3b8",fontWeight:600}}>{BUILD}</div>
          </div>
        </div>

        {/* Info rows */}
        {[
          {label:"Jogo",value:"Warzone × Black Ops 7"},
          {label:"Temporada",value:"Temporada 3 (Ativa)"},
          {label:"Atualização",value:"Notícias: 30 min · Meta: 2h"},
          {label:"Fontes",value:"wzhub.gg · warzoneloadout.games"},
        ].map(({label,value})=>(
          <div key={label} style={{
            display:"flex",justifyContent:"space-between",alignItems:"center",
            padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,.05)"
          }}>
            <span style={{fontSize:12,color:"#475569",fontWeight:600}}>{label}</span>
            <span style={{fontSize:12,color:"#94a3b8",fontWeight:600,textAlign:"right",maxWidth:"60%"}}>{value}</span>
          </div>
        ))}

        {/* Fechar */}
        <button
          onClick={onClose}
          style={{
            width:"100%",marginTop:24,padding:"14px",
            background:"rgba(249,115,22,.1)",border:"1px solid rgba(249,115,22,.2)",
            borderRadius:12,color:"#f97316",fontSize:14,fontWeight:700,cursor:"pointer"
          }}
        >Fechar</button>
      </div>
    </div>
  );
}

export default function App(){
  const[tab,setTab]=useState("meta");
  const[sobre,setSobre]=useState(false);
  const Page=PAGES[tab];

  return(
    <div style={{minHeight:"100dvh",background:"#0a0a0f",display:"flex",flexDirection:"column"}}>
      {/* Header */}
      <header style={{
        position:"sticky",top:0,zIndex:50,
        background:"rgba(10,10,15,0.92)",
        backdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(255,255,255,.05)",
        padding:"14px 20px 12px"
      }}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",maxWidth:600,margin:"0 auto"}}>
          {/* Logo + nome — clicável para abrir Sobre */}
          <button
            onClick={()=>setSobre(true)}
            style={{display:"flex",alignItems:"center",gap:10,background:"none",border:"none",cursor:"pointer",padding:0}}
          >
            <div style={{
              width:36,height:36,borderRadius:10,
              background:"linear-gradient(135deg,#f97316,#c2410c)",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 0 20px rgba(249,115,22,.5)",flexShrink:0
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                <circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="2"/>
                <line x1="12" y1="3" x2="12" y2="7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="17" x2="12" y2="21" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="12" x2="7" y2="12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                <line x1="17" y1="12" x2="21" y2="12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{textAlign:"left"}}>
              <div style={{fontSize:15,fontWeight:900,color:"#f1f5f9",letterSpacing:1.2,textTransform:"uppercase",lineHeight:1.2}}>
                Warzone <span style={{color:"#f97316"}}>Recon</span>
              </div>
              <div style={{fontSize:9,color:"#334155",letterSpacing:.4,fontWeight:600,display:"flex",gap:4,alignItems:"center"}}>
                <span style={{color:"#f97316"}}>by Shark</span>
                <span>·</span>
                <span>{HEADER[tab]?.sub}</span>
              </div>
            </div>
          </button>

          {/* Indicador ao vivo */}
          <div style={{display:"flex",alignItems:"center",gap:5,
            background:"rgba(34,197,94,.08)",border:"1px solid rgba(34,197,94,.15)",
            borderRadius:20,padding:"4px 10px"}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#22c55e",
              animation:"pulse 2s infinite",display:"inline-block"}}/>
            <span style={{fontSize:10,color:"#22c55e",fontWeight:700}}>AO VIVO</span>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main style={{flex:1,overflowY:"auto",padding:"20px 16px 90px",maxWidth:600,margin:"0 auto",width:"100%"}}>
        <Page key={tab}/>
      </main>

      <BottomNav tab={tab} setTab={setTab}/>

      {/* Modal Sobre */}
      {sobre&&<SobreModal onClose={()=>setSobre(false)}/>}
    </div>
  );
}
