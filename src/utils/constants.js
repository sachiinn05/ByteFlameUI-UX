export const BASE_URL =
  import.meta.env.VITE_BASE_URL ||
  (typeof location !== "undefined" && location.hostname === "localhost"
    ? "http://localhost:9000"
    : "https://byteflame-backend.onrender.com");

export const DEFAULT_AVATAR =
  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg";

export const resolvePhotoUrl = (url) => {
  if (!url) return DEFAULT_AVATAR;
  if (
    url.startsWith("blob:") ||
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }
  return `${BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
};
