import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { federation } from "@module-federation/vite";
import { remoteSettings, vueShared } from "../../build/federation";

const settings = remoteSettings("vue-clients");

export default defineConfig({
  base: settings.base,
  plugins: [
    // <demo-*> tags are Web Components from @demo/shared/ui, not Vue components.
    vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith("demo-") } } }),
    federation({
      name: settings.federationName,
      filename: "remoteEntry.js",
      exposes: { "./app": "./src/remote.ts" },
      shared: vueShared,
      dts: false,
    }),
  ],
  server: settings.server,
  preview: settings.preview,
  build: { target: "es2022" },
});
