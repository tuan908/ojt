import {SignJWT, jwtVerify, type JWTPayload} from 'jose';
import {cookies} from 'next/headers';
import {cache} from 'react';
import {SESSION} from '~/shared/constants';

export interface ISession extends JWTPayload {
  code: string;
  name: string;
  username: string;
  grade: string;
  role: string;
}

function getJwtSecretKey(): Uint8Array {
  const sessionSecret = process.env.SESSION_SECRET;

  if (!sessionSecret) {
    throw new Error('JWT Secret key is not defined');
  }
  return new TextEncoder().encode(sessionSecret);
}

export async function decrypt(input: string) {
  try {
    const {payload} = await jwtVerify(input, getJwtSecretKey());
    return payload as ISession;
  } catch {
    return undefined;
  }
}

/**
 * Generate token base on username and role
 * @param username username
 * @param role role
 * @returns JWT Token
 * @author tuanna
 */
export async function encrypt(dto: ISession) {
  return await new SignJWT(dto)
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('1 days')
    .sign(getJwtSecretKey());
}

export const getSession = cache(async () => {
  const reqCookies = await cookies();
  const session = reqCookies.get(SESSION)?.value;

  if (!session || !(await decrypt(session))) {
    return undefined;
  }

  return await decrypt(session);
});
