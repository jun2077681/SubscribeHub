import jwt from 'jwt-decode';

export const jwtDecode = <T>(token: string) => {
  try {
    const decodedToken = jwt(token);
    return decodedToken as T;
  } catch (error) {
    return null;
  }
};
