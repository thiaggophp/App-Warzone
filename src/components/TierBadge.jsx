const TIER_STYLES={
  "S":{bg:"rgba(245,158,11,.18)",color:"#f59e0b",border:"rgba(245,158,11,.45)",glow:"0 0 10px rgba(245,158,11,.2)",label:"S"},
  "A":{bg:"rgba(249,115,22,.15)",color:"#f97316",border:"rgba(249,115,22,.4)",glow:"none",label:"A"},
  "B":{bg:"rgba(74,222,128,.1)",color:"#4ade80",border:"rgba(74,222,128,.3)",glow:"none",label:"B"},
  "C":{bg:"rgba(100,116,139,.08)",color:"#64748b",border:"rgba(100,116,139,.2)",glow:"none",label:"C"},
  "Meta Absoluta":{bg:"rgba(245,158,11,.18)",color:"#f59e0b",border:"rgba(245,158,11,.45)",glow:"0 0 10px rgba(245,158,11,.2)",label:"S"},
  "Meta":{bg:"rgba(249,115,22,.15)",color:"#f97316",border:"rgba(249,115,22,.4)",glow:"none",label:"A"},
  "Aceitável":{bg:"rgba(74,222,128,.1)",color:"#4ade80",border:"rgba(74,222,128,.3)",glow:"none",label:"B"},
};

export default function TierBadge({tier,small}){
  const s=TIER_STYLES[tier]||TIER_STYLES["C"];
  const display=TIER_STYLES[tier]?.label||tier;
  return(
    <span style={{
      display:"inline-flex",alignItems:"center",justifyContent:"center",
      background:s.bg,color:s.color,
      border:`1px solid ${s.border}`,
      borderRadius:small?4:6,
      padding:small?"2px 7px":"4px 10px",
      fontSize:small?10:12,fontWeight:900,letterSpacing:1,
      minWidth:small?24:32,textAlign:"center",
      textTransform:"uppercase",
      boxShadow:s.glow
    }}>{display}</span>
  );
}
