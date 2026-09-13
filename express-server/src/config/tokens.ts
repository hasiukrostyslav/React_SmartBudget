// Single source of truth for session lifetimes. Both the JWT `expiresIn` and
// the cookie `maxAge` derive from these, so they cannot drift apart — a cookie
// outliving its token means needless 401s; the reverse means needless logouts.
export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;
