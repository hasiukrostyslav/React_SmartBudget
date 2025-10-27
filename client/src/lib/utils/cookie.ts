export const getCsrfCookie = () => {
  return document.cookie
    .split('; ')
    .find((str) => str.includes('csrf-token'))
    ?.split('=')
    .at(-1);
};
