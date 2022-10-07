import { Client, errors, GrantBody, Issuer } from 'openid-client';
import { JWK } from 'jose';
import OPError = errors.OPError;
import RPError = errors.RPError;

let tokenXIssuer: Issuer<Client>;
export async function getTokenXIssuer(): Promise<Issuer<Client>> {
  if (tokenXIssuer == null) {
    tokenXIssuer = await Issuer.discover(process.env.TOKEN_X_WELL_KNOWN_URL as string);
  }

  return tokenXIssuer;
}

let client: Client | null = null;
async function getTokenXAuthClient(): Promise<Client> {
  if (client) return client;

  const jwk: JWK = JSON.parse(process.env.TOKEN_X_PRIVATE_JWK as string);
  const tokenXIssuer = await getTokenXIssuer();

  client = new tokenXIssuer.Client(
    {
      client_id: process.env.TOKEN_X_CLIENT_ID as string,
      token_endpoint_auth_method: 'private_key_jwt',
    },
    { keys: [jwk] }
  );

  return client;
}

export async function grantTokenXOboToken(subjectToken: string, audience: string): Promise<string | null> {
  const client = await getTokenXAuthClient();
  const now = Math.floor(Date.now() / 1000);
  const additionalClaims = {
    clientAssertionPayload: {
      nbf: now,
      aud: client.issuer.metadata.token_endpoint,
    },
  };

  const grantBody: GrantBody = {
    grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
    audience,
    subject_token: subjectToken,
  };

  try {
    const tokenSet = await client.grant(grantBody, additionalClaims);
    if (!tokenSet.access_token) {
      throw new Error('TokenSet does not contain an access_token');
    }
    return tokenSet.access_token;
  } catch (err) {
    if (err instanceof OPError || err instanceof RPError) {
      // Something went wrong communicating with tokendings
      // There is some useful information here
      console.error(
        `Noe gikk galt med token exchange mot TokenX.
         Feilmelding fra openid-client: (${err}).
         HTTP Status fra TokenX: (${err.response?.statusCode} ${err.response?.statusMessage})
         Body fra TokenX: ${JSON.stringify(err.response?.body)}`
      );
    }

    console.error('Unknown error', err);
    return null;
  }
}
