export const useAuth = () => {
  const key = "is_authenticated";

  const is_authenticated = () => {
    return sessionStorage.getItem(key);
  }

  const login = () => {
    sessionStorage.setItem(key, true)
  };

  const logout = () => {
    sessionStorage.removeItem(key);
  };

  return { is_authenticated, login, logout };
};
