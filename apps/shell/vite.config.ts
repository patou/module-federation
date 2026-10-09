import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: "shell",
      remotes: {
        vue_remote: { type: "module", name: "vue_remote", entry: "http://localhost:5001/remoteEntry.js" },
        angular_remote: { type: "module", name: "angular_remote", entry: "http://localhost:5002/remoteEntry.js" },
      },
      shared: { vue: { singleton: true } },
      dts: false,
    }),
  ],
  server: { port: 5000, strictPort: true },
  build: { target: "es2022" },
});
