import type { NextPage } from "next";
import Head from "next/head";
import * as styles from "./index.module.css";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Dekoratøren eksempel</title>
      </Head>
      <div className={styles.container}>Noe fint innhold her</div>
    </div>
  );
};

export default Home;
