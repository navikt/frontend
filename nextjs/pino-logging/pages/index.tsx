import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from "react";

import { logger } from "../utils/logger";

const Home: NextPage = () => {
    useEffect(() => {
        const interval = setInterval(async () => {
            const result = await fetch("/api/hello").then(response => response.json());

            logger.info(`I'm a browser! I got a response from the server, it was: ${result.name}.`);
        }, 5000);

        return () => clearInterval(interval);
    })

  return (
    <div>
      <Head>
        <title>NextJS App with client and server logging</title>
      </Head>

      <main>
        Hello, please open the console to see client logs, or look in the server
        logs to see both frontend and backend logs.
      </main>
    </div>
  );
}

export default Home
