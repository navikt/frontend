import React from "react";

const MikrofrontendB = React.lazy(() =>
  import("http://localhost:7200/bundle.js")
);
const MikrofrontendC = React.lazy(() =>
  import("http://localhost:7300/bundle.js")
);

const App = () => (
  <section>
    <h2>App a</h2>
    <MikrofrontendB />
    <MikrofrontendC />
  </section>
);

export default App;
