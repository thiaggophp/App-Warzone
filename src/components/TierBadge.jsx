const TIER_STYLES={
  "S":{bg:"rgba(251,191,36,.15)",color:"#fbbf24",border:"rgba(251,191,36,.3)",label:"S"},
  "A":{bg:"rgba(249,115,22,.12)",color:"#f97316",border:"rgba(249,115,22,.3)",label:"A"},
  "B":{bg:"rgba(34,197,94,.1)",color:"#22c55e",border:"rgba(34,197,94,.25)",label:"B"},
  "C":{bg:"rgba(100,116,139,.1)",color:"#64748b",border:"rgba(100,116,139,.2)",label:"C"},
  "Meta Absoluta":{bg:"rgba(251,191,36,.15)",color:"#fbbf24",border:"rgba(251,191,36,.3)",label:"S"},
  "Meta":{bg:"rgba(249,115,22,.12)",color:"#f97316",border:"rgba(249,115,22,.3)",label:"A"},
  "Aceitável":{bg:"rgba(34,197,94,.1)",color:"#22c55e",border:"rgba(34,197,94,.25)",label:"B"},
};

export default function TierBadge({tier,small}){
  const s=TIER_STYLES[tier]||TIER_STYLES["C"];
  const display=TIER_STYLES[tier]?.label||tier;
  return(
    <span style={{
      display:"inline-flex",alignItems:"center",justifyContent:"center",
      background:s.bg,color:s.color,
      border:`1px solid ${s.border}`,
      borderRadius:small?6:8,
      padding:small?"2px 7px":"4px 10px",
      fontSize:small?10:12,fontWeight:800,letterSpacing:.5,
      minWidth:small?24:32,textAlign:"center"
    }}>{display}</span>
  );
}
