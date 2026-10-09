import { bootstrap } from "./bootstrap";

const container = document.getElementById("app");
if (!container) throw new Error("Conteneur Angular absent");

bootstrap(container).catch((error: unknown) => {
  console.error("Impossible de démarrer Angular", error);
  container.textContent = "Impossible de démarrer l’application Angular.";
});
