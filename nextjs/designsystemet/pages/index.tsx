import { Star } from "@navikt/ds-icons";
import { Button, Link } from "@navikt/ds-react";
import { Header } from "@navikt/ds-react-internal";
import type { NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>DS-eksempel</title>
      </Head>
      <Header>
        <Header.Title>Demo</Header.Title>
      </Header>
      <main>
        <Button icon={<Star aria-hidden />}>Klikk meg!</Button>
        <NextLink passHref href="/#">
          <Link>Lenke til en side</Link>
        </NextLink>

        <NextLink passHref href="/">
          <Button as="a">{`Knapp med "a"-tag`}</Button>
        </NextLink>
      </main>
    </div>
  );
};

export default Home;
