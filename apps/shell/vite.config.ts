import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { federation } from "@module-federation/vite";
import { publicBases, remoteAppNames, remoteApps } from "../../build/public-bases";
import { vueShared } from "../../build/federation";

const bases = publicBases(process.env.PAGES_BASE_URL);

export default defineConfig({
  base: bases.shell,
  plugins: [
    vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith("demo-") } } }),
    federation({
      name: "shell",
      remotes: Object.fromEntries(remoteAppNames.map((app) => {
        const name = remoteApps[app].federationName;
        return [name, { type: "module", name, entry: `${bases.remotes[app]}remoteEntry.js` }];
      })),
      shared: vueShared,
      dts: false,
    }),
  ],
  server: { port: 5000, strictPort: true },
  preview: { port: 5000, strictPort: true },
  build: { target: "es2022" },
});
