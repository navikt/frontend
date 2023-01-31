import React, { useEffect } from "react"
import { injectMikrofrontendA } from "http://localhost:7100/bundle.js"
import { injectMikrofrontendB } from "http://localhost:7200/bundle.js"

const mountpointA = "mikrofrontend-a";
const mountpointB = "mikrofrontend-b";

const ReactComponent = () => {
  useEffect(() => {
    injectMikrofrontendA(mountpointA);
    injectMikrofrontendB(mountpointB);
  }, []);

  return (
    <>
      <div id={mountpointA} />
      <div id={mountpointB} />
    </>
  );
};

export default ReactComponent;