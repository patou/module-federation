import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { remoteAppNames } from "../build/public-bases.ts";

// GitHub Pages layout: the shell at the root, each remote under remotes/<app>/.
const output = new URL("../dist/pages/", import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(new URL("../apps/shell/dist/", import.meta.url), output, { recursive: true });
for (const app of remoteAppNames) {
  await cp(new URL(`../apps/${app}/dist/`, import.meta.url),
    new URL(`remotes/${app}/`, output), { recursive: true });
}
await writeFile(new URL(".nojekyll", output), "");
