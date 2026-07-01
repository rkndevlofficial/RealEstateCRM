import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Lenis from "@studio-freight/lenis";

import "./index.css";
import App from "./App.jsx";

const lenis = new Lenis({
  duration: 1.5,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const setupAdminManifest = () => {
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  if (!isAdminRoute) return;

  const existingManifest = document.querySelector('link[rel="manifest"]');

  if (!existingManifest) {
    const manifestLink = document.createElement("link");
    manifestLink.rel = "manifest";
    manifestLink.href = "/admin-manifest.webmanifest";
    document.head.appendChild(manifestLink);
  }

  const existingAppleIcon = document.querySelector(
    'link[rel="apple-touch-icon"]'
  );

  if (!existingAppleIcon) {
    const iconLink = document.createElement("link");
    iconLink.rel = "apple-touch-icon";
    iconLink.href = "/aranyak-logo.png";
    document.head.appendChild(iconLink);
  }
};

setupAdminManifest();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);