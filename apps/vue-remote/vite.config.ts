import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { federation } from "@module-federation/vite";

export default defineConfig({
  base: "http://localhost:5001/",
  plugins: [
    vue(),
    federation({
      name: "vue_remote",
      filename: "remoteEntry.js",
      exposes: { "./app": "./src/remote.ts" },
      shared: { vue: { singleton: true } },
      dts: false,
    }),
  ],
  server: { port: 5001, strictPort: true, cors: true, origin: "http://localhost:5001" },
  preview: { cors: true },
  build: { target: "es2022" },
});
