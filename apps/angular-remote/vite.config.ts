import { defineConfig } from "vite";
import angular from "@analogjs/vite-plugin-angular";
import { federation } from "@module-federation/vite";
import { publicBases } from "../../build/public-bases";

const angularShare = { singleton: true, requiredVersion: "21.2.0" };

export default defineConfig({
  base: publicBases(process.env.PAGES_BASE_URL).angular,
  resolve: { mainFields: ["module"] },
  plugins: [
    angular({ tsconfig: "./tsconfig.app.json" }),
    federation({
      name: "angular_remote",
      filename: "remoteEntry.js",
      exposes: { "./app": "./src/remote.ts" },
      shared: {
        "@angular/core": angularShare,
        "@angular/common": angularShare,
        "@angular/router": angularShare,
        "@angular/platform-browser": angularShare,
        rxjs: { singleton: true, requiredVersion: "^7.8.2" },
      },
      dts: false,
    }),
  ],
  server: {
    port: 5002,
    strictPort: true,
    cors: true,
    origin: "http://localhost:5002",
  },
  preview: { port: 5002, strictPort: true, cors: true },
  build: { target: "es2022" },
});
