export interface User {
  id: string;
  name: string;
  email: string;
  issueAt?: string;
  expAt?: string;
  //[key: string]: any;
}

export type LoginData = {
  name: string;
  email: string;
  password: string;
};

export type JwtClaims = {
  sub: string;
  name: string;
  email: string;
  iat?: any;
};

export type TokenType = string | null;
