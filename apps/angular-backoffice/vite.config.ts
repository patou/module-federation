import { defineConfig } from "vite";
import angular from "@analogjs/vite-plugin-angular";
import { federation } from "@module-federation/vite";
import { angularShared, remoteSettings } from "../../build/federation";

const settings = remoteSettings("angular-backoffice");

export default defineConfig({
  base: settings.base,
  resolve: { mainFields: ["module"] },
  plugins: [
    angular({ tsconfig: "./tsconfig.app.json" }),
    federation({
      name: settings.federationName,
      filename: "remoteEntry.js",
      exposes: { "./app": "./src/remote.ts" },
      shared: angularShared,
      dts: false,
    }),
  ],
  server: settings.server,
  preview: settings.preview,
  build: { target: "es2022" },
});
