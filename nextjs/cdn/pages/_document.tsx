import { cloneElement } from "react";

import { readFileSync } from "fs";
import { SUBRESOURCE_INTEGRITY_MANIFEST } from "next/constants";
import Document, { Html, Head, Main, NextScript } from "next/document";

class CustomHead extends Head {
  getScripts(files: any) {
    const originalScripts = super.getScripts(files);
    const hashes = JSON.parse(
      readFileSync(
        `.next/server/${SUBRESOURCE_INTEGRITY_MANIFEST}.json`,
        "utf8"
      )
    );
    return originalScripts.map((script) => {
      return cloneElement(script, {
        integrity: hashes[script.key ?? ""],
        crossorigin: "anonymous",
      });
    });
  }
}

class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <CustomHead />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
