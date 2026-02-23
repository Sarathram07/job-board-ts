import { jwtDecode } from "jwt-decode";
import type {
  JwtClaims,
  LoginData,
  TokenType,
  User,
} from "./graphql/dataTypes/userType";

const API_URL: string = import.meta.env.VITE_LOGIN_URL;
const ACCESS_TOKEN_KEY = "accessToken";

export function getAccessToken(): TokenType {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(key: string, data: string): void {
  localStorage.setItem(key, data);
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
  setAccessToken(ACCESS_TOKEN_KEY, token);
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
  const { issueDate, expDate } = calcExpDate(claims);

  return {
    name: claims.name,
    id: claims.sub,
    email: claims.email,
    issueAt: issueDate,
    expAt: expDate,
  };
}

function calcExpDate(claims: JwtClaims) {
  const iat = claims.iat;
  // Token lifetime in seconds (e.g., 1 hour = 3600 seconds)
  const tokenLifetime = 3600;

  // Convert iat to human-readable date
  const convertedDate = new Date(iat * 1000); // JS Date uses milliseconds
  const issueDate = convertedDate.toLocaleDateString();

  // Calculate expiration time
  const exp = iat + tokenLifetime;
  const newexp = new Date(exp * 1000);
  const expDate = newexp.toLocaleDateString();
  //console.log(expDate.toLocaleDateString()); //dateObj.toLocaleTimeString()
  //console.log("Expires At:", expDate.toUTCString());

  return { issueDate, expDate };
}
