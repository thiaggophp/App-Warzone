const TABS=[
  {id:"meta",label:"Meta",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>},
  {id:"loadouts",label:"Loadouts",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>},
  {id:"sugestoes",label:"Sugestões",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>},
  {id:"eventos",label:"Eventos",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>},
  {id:"temporada",label:"Temporada",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>},
  {id:"noticias",label:"Notícias",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>},
  {id:"patches",label:"Patches",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>},
];

export default function BottomNav({tab,setTab}){
  return(
    <nav style={{
      position:"fixed",bottom:0,left:0,right:0,
      background:"rgba(10,10,15,0.95)",
      backdropFilter:"blur(20px)",
      borderTop:"1px solid rgba(255,255,255,0.06)",
      display:"flex",alignItems:"stretch",
      paddingBottom:"env(safe-area-inset-bottom)",
      zIndex:100
    }}>
      {TABS.map(t=>{
        const active=tab===t.id;
        return(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:1,display:"flex",flexDirection:"column",alignItems:"center",
            justifyContent:"center",gap:3,padding:"10px 0 8px",
            background:"none",border:"none",cursor:"pointer",
            color:active?"#f97316":"#475569",
            transition:"color .2s",position:"relative"
          }}>
            {active&&<span style={{
              position:"absolute",top:0,left:"20%",right:"20%",height:2,
              background:"#f97316",borderRadius:"0 0 4px 4px"
            }}/>}
            <span style={{transition:"transform .2s",transform:active?"scale(1.1)":"scale(1)"}}>
              {t.icon}
            </span>
            <span style={{fontSize:9,fontWeight:active?700:500,letterSpacing:.3}}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
