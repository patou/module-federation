const statusStyles = `
  :host { display: inline-block; }
  span { display: inline-block; padding: 2px 10px; border-radius: 999px; font: 600 12px/1.6 system-ui, sans-serif; }
  .active { background: #e3f2ee; color: #125343; }
  .paused { background: #fdf0dc; color: #8a4b08; }
`;

const statStyles = `
  :host { display: block; }
  article { padding: 18px 20px; border: 1px solid #dfe5ee; border-radius: 12px; background: #fff; font-family: system-ui, sans-serif; }
  h3 { margin: 0; color: #5c6b80; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }
  strong { display: block; margin: 6px 0 2px; color: #19283c; font-size: 30px; }
  p { margin: 0; color: #69768a; font-size: 13px; }
`;

function shadow(host: HTMLElement, css: string): ShadowRoot {
  const root = host.shadowRoot ?? host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = css;
  root.replaceChildren(style);
  return root;
}

/**
 * Registers framework-agnostic UI components (Web Components) usable from Vue, Angular or plain HTML.
 * Idempotent: each application may call it, the first registration wins.
 */
export function defineDemoElements(): void {
  if (typeof customElements === "undefined") return;

  if (!customElements.get("demo-status-badge")) {
    customElements.define("demo-status-badge", class extends HTMLElement {
      static observedAttributes = ["status"];
      connectedCallback() { this.render(); }
      attributeChangedCallback() { this.render(); }
      private render() {
        const status = this.getAttribute("status") ?? "";
        const badge = document.createElement("span");
        badge.className = status === "Actif" ? "active" : "paused";
        badge.textContent = status;
        shadow(this, statusStyles).append(badge);
      }
    });
  }

  if (!customElements.get("demo-stat-card")) {
    customElements.define("demo-stat-card", class extends HTMLElement {
      static observedAttributes = ["label", "value", "hint"];
      connectedCallback() { this.render(); }
      attributeChangedCallback() { this.render(); }
      private render() {
        const article = document.createElement("article");
        const label = document.createElement("h3");
        const value = document.createElement("strong");
        const hint = document.createElement("p");
        label.textContent = this.getAttribute("label");
        value.textContent = this.getAttribute("value");
        hint.textContent = this.getAttribute("hint");
        article.append(label, value, hint);
        shadow(this, statStyles).append(article);
      }
    });
  }
}
