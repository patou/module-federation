import { app } from "./app/app";

const container = document.getElementById("app");
if (!container) throw new Error("Conteneur Angular absent");

app.startStandalone(container).catch((error: unknown) => {
  console.error("Impossible de démarrer Angular", error);
  container.textContent = "Impossible de démarrer l’application Angular.";
});
