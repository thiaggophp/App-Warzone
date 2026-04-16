import PocketBase from"pocketbase";
import{MOCK_META,MOCK_LOADOUTS,MOCK_NOTICIAS,MOCK_TEMPORADA,MOCK_EVENTOS,SUGESTOES_TEMPLATES,MOCK_PATCHES}from"./mockData";

const PB_URL=import.meta.env.VITE_PB_URL||"https://api.vexasistemas.com.br";
export const pb=new PocketBase(PB_URL);

// Tenta buscar JSON local gerado pelo scraper (public/data/*.json)
async function tryLocalJSON(file,fallback){
  try{
    const res=await fetch(`/data/${file}?_=${Date.now()}`);
    if(!res.ok)return fallback;
    const data=await res.json();
    if(Array.isArray(data)&&data.length>0)return data;
    if(data&&typeof data==="object"&&Object.keys(data).length>0)return data;
    return fallback;
  }catch{return fallback}
}

// Tenta PocketBase → JSON local → mock data
async function tryPB(collection,fetchFn,jsonFile,fallback){
  try{
    const result=await fetchFn();
    if(result&&(Array.isArray(result)?result.length>0:Object.keys(result).length>0))return result;
  }catch{/* segue para JSON local */}
  return tryLocalJSON(jsonFile,fallback);
}

export async function getMeta(){
  return tryPB(
    "wz_meta",
    ()=>pb.collection("wz_meta").getFullList({sort:"-pickRate"}),
    "meta.json",
    MOCK_META
  );
}

export async function getLoadouts(filtro=""){
  const data=await tryPB(
    "wz_loadouts",
    ()=>pb.collection("wz_loadouts").getFullList({
      filter:filtro?`tier="${filtro}"`:"",sort:"tier,arma"
    }),
    "loadouts.json",
    MOCK_LOADOUTS
  );
  // Garante que attachments e perks sejam arrays (PocketBase retorna string JSON)
  return data.map(l=>({
    ...l,
    attachments:typeof l.attachments==="string"?JSON.parse(l.attachments||"[]"):l.attachments||[],
    perks:typeof l.perks==="string"?JSON.parse(l.perks||"[]"):l.perks||[]
  }));
}

export async function getNoticias(){
  return tryPB(
    "wz_noticias",
    ()=>pb.collection("wz_noticias").getFullList({sort:"-publicadoEm",limit:20}),
    "noticias.json",
    MOCK_NOTICIAS
  );
}

export async function getTemporada(){
  return tryPB(
    "wz_temporada",
    async()=>{
      const list=await pb.collection("wz_temporada").getFullList({sort:"-inicio",limit:1});
      return list[0]||null;
    },
    "temporada.json",
    MOCK_TEMPORADA
  );
}

export async function getEventos(){
  return tryPB(
    "wz_eventos",
    ()=>pb.collection("wz_eventos").getFullList({sort:"-ativo,-inicio"}),
    "eventos.json",
    MOCK_EVENTOS
  );
}

export async function getPatches(){
  return tryPB(
    "wz_patches",
    ()=>pb.collection("wz_patches").getFullList({sort:"-data",limit:100}),
    "patches.json",
    MOCK_PATCHES
  );
}

// Retorna a melhor arma de um tipo pelo meta atual (prefere S > A > B)
function melhorArmaDeTipo(meta,tipo,excluir=""){
  const TIER_ORDER={S:0,A:1,B:2,C:3};
  return meta
    .filter(w=>w.tipo===tipo&&w.arma!==excluir)
    .sort((a,b)=>(TIER_ORDER[a.tier]??9)-(TIER_ORDER[b.tier]??9)||(b.pickRate-a.pickRate))
    [0]||null;
}

// Sugestões táticas: templates fixos + armas preenchidas pelo meta atual
export async function getSugestoes(){
  const meta=await getMeta();
  const temMeta=meta.length>0&&meta!==MOCK_META;

  return SUGESTOES_TEMPLATES.map(t=>{
    const wPrincipal=melhorArmaDeTipo(meta,t.tipoPrincipal);
    const wSec=melhorArmaDeTipo(meta,t.tipoSec,wPrincipal?.arma||"");

    const arma=wPrincipal?.arma||t.armaFallback;
    const armaSec=wSec?.arma||t.armaSecFallback;
    const tierPrincipal=wPrincipal?.tier||null;
    const tierSec=wSec?.tier||null;

    // Substitui {arma} e {armaSec} nas dicas
    const dicas=t.dicas.map(d=>d.replace(/\{arma\}/g,arma).replace(/\{armaSec\}/g,armaSec));

    return{
      ...t,
      arma,tipoArma:t.tipoPrincipal,
      armaSec,tipoArmaSec:t.tipoSec,
      tierPrincipal,tierSec,
      dicas,
      autoAtualizado:temMeta&&!!wPrincipal
    };
  });
}
