import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const output = new URL("../dist/pages/", import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(new URL("../apps/shell/dist/", import.meta.url), output, { recursive: true });
for (const [app, folder] of [["vue-remote", "vue"], ["angular-remote", "angular"]]) {
  await cp(new URL(`../apps/${app}/dist/`, import.meta.url),
    new URL(`remotes/${folder}/`, output), { recursive: true });
}
await writeFile(new URL(".nojekyll", output), "");
