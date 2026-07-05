import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "../src/content/App";
import { WIDGET_HOST_ID } from "../src/content/lib/constants";
import styles from "../src/content/styles.css?inline";

const hostEl = document.createElement("div");
hostEl.id = WIDGET_HOST_ID;
const shadow = hostEl.attachShadow({ mode: "open" });

const styleEl = document.createElement("style");
styleEl.textContent = styles;
shadow.appendChild(styleEl);

const container = document.createElement("div");
shadow.appendChild(container);
document.documentElement.appendChild(hostEl);

createRoot(container).render(
  <StrictMode>
    <App marketplaceLabel="Ozon · demo" />
  </StrictMode>,
);
