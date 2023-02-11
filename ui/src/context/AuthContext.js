const key = "is_authenticated";

export const is_authenticated = () => {
  return sessionStorage.getItem(key);
}

export const login = () => {
  sessionStorage.setItem(key, true)
};

export const logout = () => {
  sessionStorage.removeItem(key);
};
