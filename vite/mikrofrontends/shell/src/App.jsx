import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

const MikrofrontendA = React.lazy(() =>
  import("http://localhost:7100/bundle.js")
);
const MikrofrontendB = React.lazy(() =>
  import("http://localhost:7200/bundle.js")
);
const MikrofrontendC = React.lazy(() =>
  import("http://localhost:7300/bundle.js")
);

const App = () => (
  <Router>
    <Routes>
      <Route path="/" exact element={<MikrofrontendA />} />
      <Route path="/a" element={<MikrofrontendA />} />
      <Route path="/b" element={<MikrofrontendB />} />
      <Route path="/c" element={<MikrofrontendC />} />
    </Routes>
  </Router>
);

export default App;
