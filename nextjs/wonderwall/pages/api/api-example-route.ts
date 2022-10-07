// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuthenticatedApi } from '../../auth/withAuthentication';
import { grantTokenXOboToken } from '../../auth/tokenx';

type Data = {
  fetchedFromTokenXApi: string;
};

export default withAuthenticatedApi(async (req: NextApiRequest, res: NextApiResponse<Data>, accessToken) => {
  /**
   * Consideration:
   *
   * This flow is just an example, it should handle errors more gracefully.
   */
  const oboToken = await grantTokenXOboToken(accessToken, 'the-app-I-want-to-talk-to');

  const result = await fetch('https://example.com/api/something', {
    headers: { Authorization: `Bearer ${oboToken}` },
  }).then((res) => res.json());

  res.status(200).json({ fetchedFromTokenXApi: result.example });
});
