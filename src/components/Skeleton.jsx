export default function Skeleton({h=16,w="100%",radius=8,style={}}){
  return(
    <div style={{
      height:h,width:w,borderRadius:radius,
      background:"linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%)",
      backgroundSize:"200% 100%",
      animation:"shimmer 1.5s infinite",
      ...style
    }}/>
  );
}
