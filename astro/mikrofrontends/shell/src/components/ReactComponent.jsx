import React from "https://www.nav.no/tms-min-side-assets/react/18/esm/index.js"
import MicroFrontendA from "http://localhost:7100/bundle.js"
import MicroFrontendB from "http://localhost:7200/bundle.js"

const ReactComponent = () => (
  <>
    <MicroFrontendA />
    <MicroFrontendB />
  </>
);

export default ReactComponent;