import * as jwt from 'jwt-then'; // tslint:disable-line:no-implicit-dependencies

export const generateToken = async (claims, expiresIn, secretKey): Promise<string> => {
  return jwt.sign(claims, secretKey, {
    expiresIn,
  });
};

export const verifyToken = async (token: string, secretKey: string) => {
  return jwt.verify(token, secretKey);
};
