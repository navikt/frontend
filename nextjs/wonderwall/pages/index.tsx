import type { NextPage } from 'next';
import Head from 'next/head';

import { withAuthenticatedPage } from '../auth/withAuthentication';
import { grantTokenXOboToken } from '../auth/tokenx';

interface Props {
  ssredValue: string;
}

const Home: NextPage<Props> = ({ ssredValue }) => {
  return (
    <div>
      <Head>
        <title>Authed Wonderwall App</title>
      </Head>

      <main>This page should be authed :)</main>
      <div>{ssredValue}</div>
    </div>
  );
};

export const getServerSideProps = withAuthenticatedPage(async (context, accessToken) => {
  /**
   * Consideration:
   *
   * Exiting early for local testdata might not be the best way.
   */
  if (process.env.NODE_ENV !== 'production') {
    return {
      props: {
        ssredValue: 'fake SSRed value',
      },
    };
  }

  /**
   * Consideration:
   *
   * This flow is just an example, it should handle errors more gracefully.
   */
  const oboToken = await grantTokenXOboToken(accessToken, 'the-app-I-want-to-talk-to');

  const result = await fetch('https://example.com/api/something', {
    headers: { Authorization: `Bearer ${oboToken}` },
  }).then((res) => res.json());

  return {
    props: {
      ssredValue: result,
    },
  };
});

export default Home;
