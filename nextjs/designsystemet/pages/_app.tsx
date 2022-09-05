import "../styles/globals.css";
import "@navikt/ds-css";
import "@navikt/ds-css-internal";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
