import { jwtDecode } from "jwt-decode";

const API_URL: string = import.meta.env.VITE_LOGIN_URL;
const ACCESS_TOKEN_KEY = "accessToken";

// Login payload interface
export interface LoginData {
  email: string;
  password: string;
}

// User object interface
export interface User {
  id: string;
  name: string;
  email: string;
}

// JWT claims interface (including expiration)
interface JwtClaims {
  sub: string;
  name: string;
  email: string;
  exp?: number; // optional expiration timestamp (seconds since epoch)
  [key: string]: any;
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export async function login(data: LoginData): Promise<User | null> {
  console.log("API_URL:", API_URL);

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    return null;
  }

  const { token }: { token: string } = await response.json();
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  return getUserFromToken(token);
}

export function getUser(): User | null {
  const token = getAccessToken();
  if (!token) return null;

  const user = getUserFromToken(token);

  // Check token expiration
  // const claims: JwtClaims = jwtDecode<JwtClaims>(token);
  // if (claims.exp && Date.now() >= claims.exp * 1000) {
  //   logout(); // remove expired token
  //   return null;
  // }

  return user;
}

export function logout(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

function getUserFromToken(token: string): User {
  const claims: JwtClaims = jwtDecode<JwtClaims>(token);
  return {
    id: claims.sub,
    name: claims.name,
    email: claims.email,
  };
}
