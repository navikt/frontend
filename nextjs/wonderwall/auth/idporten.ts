import { createRemoteJWKSet, jwtVerify, errors } from 'jose';
import { Client, Issuer } from 'openid-client';

let idportenIssuer: Issuer<Client>;
export async function getIdportenIssuer(): Promise<Issuer<Client>> {
  if (idportenIssuer == null) {
    idportenIssuer = await Issuer.discover(process.env.IDPORTEN_WELL_KNOWN_URL ?? '// TODO bedre envs');
  }

  return idportenIssuer;
}

let remoteJWKSet: ReturnType<typeof createRemoteJWKSet>;
export async function getJwkSet(): Promise<ReturnType<typeof createRemoteJWKSet>> {
  if (remoteJWKSet == null) {
    const issuer = await getIdportenIssuer();
    remoteJWKSet = createRemoteJWKSet(new URL(<string>issuer.metadata.jwks_uri));
  }

  return remoteJWKSet;
}

export async function validateIdportenToken(bearerToken: string): Promise<boolean> {
  const issuer = await getIdportenIssuer();
  const jwkSet = await getJwkSet();

  try {
    const verificationResult = await jwtVerify(bearerToken, jwkSet, {
      issuer: issuer.metadata.issuer,
    });

    if (verificationResult.payload.client_id !== process.env.IDPORTEN_CLIENT_ID) {
      console.error('client id mismatch');
      return false;
    }

    if (verificationResult.payload.acr !== 'Level4') {
      console.error('acr is not Level4');
      return false;
    }

    return true;
  } catch (err) {
    if (err instanceof errors.JWTExpired) {
      console.error('JWT is expired');
      console.error(err);
      return false;
    }
    if (err instanceof errors.JOSEError) {
      console.error('JWT is unknown error');
      console.error(err);
      return false;
    }

    console.error('Some unknown error');
    console.error(err);
    return false;
  }
}
