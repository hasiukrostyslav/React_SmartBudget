// HTTP status codes used by server actions and route handlers
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  SERVER_ERROR: 500,
};

export const TRANSACTION_SEARCH_PARAMS = {
  LIMIT: 'limit',
  PAGE: 'page',
  CATEGORIES: 'categories',
  TYPES: 'types',
  ACCOUNTS: 'accounts',
  SORT: 'sort',
  ORDER: 'order',
} as const;
