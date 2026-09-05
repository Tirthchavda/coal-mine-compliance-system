import jsonwebtoken from 'jsonwebtoken';

// Safe unwrapping for CommonJS in ESM
const jwtModule: any = (jsonwebtoken as any).default || jsonwebtoken;

export const signToken = (payload: any, secret: string, options?: any): string => {
  if (typeof jwtModule.sign === 'function') {
    return jwtModule.sign(payload, secret, options);
  }
  if (jsonwebtoken && typeof (jsonwebtoken as any).sign === 'function') {
    return (jsonwebtoken as any).sign(payload, secret, options);
  }
  // Fallback base64 token if native jwt fails
  const b64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  return `statutory.${b64}.token`;
};

export const verifyToken = (token: string, secret: string): any => {
  if (typeof jwtModule.verify === 'function') {
    return jwtModule.verify(token, secret);
  }
  if (jsonwebtoken && typeof (jsonwebtoken as any).verify === 'function') {
    return (jsonwebtoken as any).verify(token, secret);
  }
  if (token.startsWith('statutory.')) {
    const parts = token.split('.');
    return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
  }
  throw new Error('Invalid token');
};

export default {
  sign: signToken,
  verify: verifyToken
};

