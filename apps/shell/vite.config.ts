import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { federation } from "@module-federation/vite";
import { publicBases } from "../../build/public-bases";

const bases = publicBases(process.env.PAGES_BASE_URL);

export default defineConfig({
  base: bases.shell,
  plugins: [
    vue(),
    federation({
      name: "shell",
      remotes: {
        vue_remote: { type: "module", name: "vue_remote", entry: `${bases.vue}remoteEntry.js` },
        angular_remote: { type: "module", name: "angular_remote", entry: `${bases.angular}remoteEntry.js` },
      },
      shared: { vue: { singleton: true } },
      dts: false,
    }),
  ],
  server: { port: 5000, strictPort: true },
  build: { target: "es2022" },
});
