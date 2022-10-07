import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiRequest, NextApiResponse } from 'next';
import { validateIdportenToken } from './idporten';

export type ApiHandler = (req: NextApiRequest, res: NextApiResponse, accessToken: string) => void | Promise<unknown>;
export type PageHandler = (
  context: GetServerSidePropsContext,
  accessToken: string
) => Promise<GetServerSidePropsResult<unknown>>;

/**
 * Consideration:
 *
 * Higher-order-function (this implementation) or would it be better to use
 * NextJS middlewares (https://nextjs.org/docs/advanced-features/middleware)?
 *
 */
export function withAuthenticatedPage(handler: PageHandler) {
  return async (context: GetServerSidePropsContext): Promise<ReturnType<NonNullable<typeof handler>>> => {
    /**
     * Consideration:
     *
     * Is skipping authentication for local development a good idea? Maybe configuring up a local
     * instance of Wonderwall is a better idea?
     */
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Is running locally or in demo, skipping authentication for page for ${context.resolvedUrl}`);
      return handler(context, 'fake-local-token');
    }

    const bearerToken: string | null | undefined = context.req.headers['authorization'];
    if (!bearerToken) {
      return {
        redirect: { destination: `/oauth2/login?redirect=${context.resolvedUrl}`, permanent: false },
      };
    }

    const accessToken = bearerToken.replace('Bearer ', '');
    const validToken = validateIdportenToken(accessToken);
    if (!validToken) {
      return {
        redirect: { destination: `/oauth2/login?redirect=${context.resolvedUrl}`, permanent: false },
      };
    }

    return handler(context, accessToken);
  };
}

export async function withAuthenticatedApi(handler: ApiHandler): Promise<ReturnType<typeof handler>> {
  return (req: NextApiRequest, res: NextApiResponse) => {
    /**
     * Consideration:
     *
     * Is skipping authentication for local development a good idea? Maybe configuring up a local
     * instance of Wonderwall is a better idea?
     */
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Is running locally or in demo, skipping authentication for API ${req.url}`);
      return handler(req, res, 'fake-local-token');
    }

    const bearerToken: string | null | undefined = req.headers['authorization'];
    if (!bearerToken) {
      res.status(401).json({ message: 'Access denied' });
      return;
    }

    const accessToken = bearerToken.replace('Bearer ', '');
    const validToken = validateIdportenToken(accessToken);
    if (!validToken) {
      res.status(401).json({ message: 'Access denied' });
      return;
    }

    return handler(req, res, accessToken);
  };
}
