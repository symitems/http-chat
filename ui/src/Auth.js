import { useLocation, Navigate } from "react-router-dom";

export function RequireToken({ children }) {
  const cookies = document.cookie;
  const cookieName = "access_token";
  let location = useLocation();

  const cookieList = cookies.split(";");
  for (const cookie of cookieList) {
    const [name, value] = cookie.split("=");
    if (name.trim() === cookieName) {
      return children;
    }
  }
  return <Navigate to="/" state={{ from: location }} />;
}
