import React from "react";
import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";

interface Props {
  children: React.ReactNode;
}

const decorator = await fetchDecoratorReact({
  env: "dev",
  context: "privatperson",
});

const { Styles, Scripts, Header, Footer } = decorator;

const Decorator = ({ children }: Props) => {
  return (
    <React.Fragment>
      <Styles />
      <Scripts />
      <Header />
      {children}
      <Footer />
    </React.Fragment>
  );
};

export default Decorator;
