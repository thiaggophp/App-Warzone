import{defineConfig}from"vite";
import react from"@vitejs/plugin-react";
import{readFileSync}from"fs";

const pkg=JSON.parse(readFileSync("./package.json","utf-8"));

export default defineConfig({
  define:{
    __APP_VERSION__:JSON.stringify(pkg.version),
    __APP_NAME__:JSON.stringify(pkg.name),
    __BUILD_DATE__:JSON.stringify(new Date().toISOString().split("T")[0])
  },
  plugins:[react()],
  server:{host:true,port:5174},
  resolve:{conditions:["browser","module","import","default"]},
  optimizeDeps:{include:["pocketbase"]}
});
