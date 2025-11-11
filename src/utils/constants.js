export const BASE_URL =
  location.hostname === "localhost"
    ? "http://localhost:9000"
    : ""; // empty string → same origin (Vercel rewrite)
