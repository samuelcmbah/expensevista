
export const getUser = (): any | null => {
  const raw =
    localStorage.getItem("expensevista_user") ?? sessionStorage.getItem("expensevista_user");
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setUserStorage = (user: any, remember: boolean) => {
  const data = JSON.stringify(user);
  if (remember) localStorage.setItem("expensevista_user", data);
  else sessionStorage.setItem("expensevista_user", data);
};

export const clearUserStorage = () => {
  localStorage.removeItem("expensevista_user");
  sessionStorage.removeItem("expensevista_user");
};
