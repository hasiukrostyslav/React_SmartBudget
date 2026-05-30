export const METADATA_TEXT = {
  GLOBAL: {
    template: '%s | SmartBudget',
    title: 'Welcome | SmartBudget',
    description: 'Smart Money, Bright Tomorrow',
  },
  FORGOT_PASSWORD: 'Forgot Password',
  SIGN_IN: 'Sign In',
  SIGN_UP: 'Sign Up',
  NOT_FOUND_PAGE: 'Page not Found',
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized. Please sign in!',
  SOMETHING_WENT_WRONG: 'Something went wrong',
  auth: {
    INVALID_CREDENTIALS: 'Invalid credentials',
    EMAIL_EXISTS: 'An account with this email already exists.',
    INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password!',
  },
  transaction: {
    FETCH_MANY: 'Failed to fetch transactions',
    FETCH_ONE: 'Failed to fetch transaction',
    NOT_FOUND: 'Transaction not found',
    CREATE: 'Failed to create transaction',
    UPDATE: 'Failed to update transaction',
    UPDATE_STATUS: 'Failed to update transaction status',
    UPDATE_CATEGORY: 'Failed to update transaction category',
    DELETE: 'Failed to delete transaction',
    DELETE_MANY: 'Failed to delete transactions',
  },
} as const;

export const INPUT_PLACEHOLDER = {
  email: 'Please enter your email',
  password: 'Please enter your password',
  name: 'Please enter your full name',
  search: 'Search',
} as const;

export const EMPTY_STATE_TEXT = {
  transactions: {
    header: 'No transactions yet',
    description:
      "When you add or import transactions, they'll show up here so you can search, filter and categorize them.",
    cta: {
      primaryLabel: 'Add transaction',
      secondaryLabel: 'Import from CSV',
    },
  },
  payments: {
    header: 'No payments yet',
    description:
      'Track recurring bills, subscriptions and one-time payments all in one place.',
    cta: {
      primaryLabel: 'Add payment',
      secondaryLabel: 'Import from CSV',
    },
  },
  cards: {
    header: 'No cards added',
    description:
      'Add your debit or credit cards to monitor balances and link transactions automatically.',
    cta: {
      primaryLabel: 'Add card',
    },
  },
  savings: {
    header: 'No savings goals yet',
    description:
      'Create a savings goal to start tracking your progress toward something that matters.',
    cta: {
      primaryLabel: 'Create goal',
    },
  },
  loans: {
    header: 'No loans tracked',
    description:
      'Add a loan to monitor your outstanding balance, interest, and repayment schedule.',
    cta: {
      primaryLabel: 'Add loan',
    },
  },
  deposits: {
    header: 'No deposits yet',
    description:
      'Record fixed deposits or term savings to keep tabs on maturity dates and earned interest.',
    cta: {
      primaryLabel: 'Add deposit',
    },
  },
  dashboard: {
    header: 'Your dashboard is empty',
    description:
      'Add a transaction, card, or savings goal to start seeing your financial overview here.',
    cta: {
      primaryLabel: 'Add transaction',
    },
  },
} as const;
