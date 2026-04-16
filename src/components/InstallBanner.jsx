import{useState,useEffect}from"react";

export default function InstallBanner(){
  const[prompt,setPrompt]=useState(null);
  const[showIOS,setShowIOS]=useState(false);
  const[gone,setGone]=useState(()=>!!localStorage.getItem("wz-pwa-ok"));

  useEffect(()=>{
    if(gone)return;
    const standalone=window.matchMedia("(display-mode: standalone)").matches||navigator.standalone;
    if(standalone){setGone(true);return;}
    const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
    if(isIOS){setShowIOS(true);return;}
    const h=e=>{e.preventDefault();setPrompt(e);};
    window.addEventListener("beforeinstallprompt",h);
    return()=>window.removeEventListener("beforeinstallprompt",h);
  },[gone]);

  const dismiss=()=>{localStorage.setItem("wz-pwa-ok","1");setGone(true);};
  const install=async()=>{
    if(!prompt)return;
    prompt.prompt();
    await prompt.userChoice;
    dismiss();
  };

  if(gone||(!prompt&&!showIOS))return null;

  return(
    <div style={{
      position:"fixed",bottom:72,left:0,right:0,zIndex:90,
      padding:"0 12px",maxWidth:600,margin:"0 auto",
      animation:"slideUp .3s ease"
    }}>
      <div style={{
        background:"rgba(6,10,8,.97)",
        border:"1px solid rgba(249,115,22,.3)",
        borderLeft:"3px solid #f97316",
        borderRadius:8,padding:"12px 14px",
        display:"flex",alignItems:"center",gap:10,
        boxShadow:"0 4px 24px rgba(0,0,0,.5)"
      }}>
        <div style={{
          width:36,height:36,borderRadius:8,flexShrink:0,
          background:"linear-gradient(135deg,#f97316,#c2410c)",
          display:"flex",alignItems:"center",justifyContent:"center"
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/>
          </svg>
        </div>
        <div style={{flex:1,minWidth:0}}>
          {showIOS?(
            <>
              <div style={{fontSize:12,fontWeight:700,color:"#f1f5f9",marginBottom:2}}>Instalar app</div>
              <div style={{fontSize:11,color:"#64748b",lineHeight:1.4}}>
                Toque em <span style={{color:"#f97316"}}>Compartilhar ⬆</span> → <span style={{color:"#f97316"}}>Tela Inicial</span>
              </div>
            </>
          ):(
            <>
              <div style={{fontSize:12,fontWeight:700,color:"#f1f5f9",marginBottom:2}}>Instalar Warzone Recon</div>
              <div style={{fontSize:11,color:"#64748b"}}>Acesso rápido na tela inicial</div>
            </>
          )}
        </div>
        {!showIOS&&(
          <button onClick={install} style={{
            padding:"7px 14px",borderRadius:4,border:"none",
            background:"#f97316",color:"#fff",fontSize:11,fontWeight:800,
            cursor:"pointer",flexShrink:0,letterSpacing:.5,textTransform:"uppercase"
          }}>Instalar</button>
        )}
        <button onClick={dismiss} style={{
          background:"none",border:"none",cursor:"pointer",
          color:"#475569",padding:"4px 6px",flexShrink:0,fontSize:16,lineHeight:1
        }}>✕</button>
      </div>
    </div>
  );
}
