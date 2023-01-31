import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

export const injectMikrofrontendA = (parentElementId) => {
  const container = document.getElementById(parentElementId);
  const root = createRoot(container);
  root.render(<App />);
};

const Mikrofrontend = () => <App />;

export default Mikrofrontend;
