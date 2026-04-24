export const getCsrfCookie = () => {
  const entry = document.cookie
    .split('; ')
    .find((str) => str.includes('csrf-token'));

  if (!entry) return undefined;

  return entry.slice(entry.indexOf('=') + 1);
};
