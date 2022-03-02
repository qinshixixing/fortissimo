export function checkToken(loginUrl: string, tokenKey = 'token'): void {
  const token = window.localStorage.getItem(tokenKey);
  if (!token) window.location.href = loginUrl;
}
