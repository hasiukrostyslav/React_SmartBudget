export const TRANSACTION_TYPE_CONFIG = [
  { option: 'Income', icon: 'arrow-up', color: 'text-green-500' },
  { option: 'Expenses', icon: 'arrow-down', color: 'text-red-500' },
] as const;

export const CURRENCY_CONFIG = [
  {
    currency: 'UAH',
    description: 'Ukrainian Hryvnia',
  },
  {
    currency: 'USD',
    description: 'US Dollar',
  },
  {
    currency: 'EUR',
    description: 'Euro',
  },
  {
    currency: 'PLN',
    description: 'Polish Złoty',
  },
  {
    currency: 'GBP',
    description: 'British Pound',
  },
  {
    currency: 'HUF',
    description: 'Hungarian Forint',
  },
] as const;

export const TRANSACTION_SORT_OPTIONS = [
  { name: 'Transaction Name', label: 'name' },
  { name: 'Category', label: 'category' },
  { name: 'Account', label: 'account' },
  { name: 'Date & Time', label: 'date' },
  { name: 'Amount', label: 'amount' },
  { name: 'Note', label: 'note' },
  { name: 'Status', label: 'status' },
] as const;

export const TRANSACTION_SORT_FIELD_MAP = {
  name: 'transactionName',
  account: 'paymentMethod',
  date: 'createdAt',
  amount: 'amount',
  note: 'description',
  status: 'status',
  category: 'transactionCategory',
} as const;

export const STATUS_CONFIG = {
  COMPLETED: {
    text: {
      header: 'Completed',
      description: 'Payment processed successfully',
    },
    icon: 'circle-check',
    style: {
      badge: `bg-green-700 text-slate-100 border-green-700
      dark:bg-green-700/10 dark:text-green-500`,
      card: 'border-green-600 bg-green-50 dark:bg-green-600/10',
      icon: 'bg-green-200 text-green-600 dark:bg-green-500/20',
      radio: 'border-green-600',
      text: 'text-green-600',
    },
  },
  PENDING: {
    text: {
      header: 'Pending',
      description: 'Waiting for payment to settle',
    },
    icon: 'clock',
    style: {
      badge: `bg-yellow-300 border-yellow-300 text-slate-700
      dark:text-yellow-500 dark:border-yellow-500 dark:bg-yellow-500/10`,
      card: 'border-yellow-600 bg-yellow-50 dark:bg-yellow-600/10',
      icon: 'bg-yellow-200 text-yellow-600 dark:bg-yellow-500/20',
      radio: 'border-yellow-600',
      text: 'text-yellow-600 dark:text-yellow-500',
    },
  },
  FAILED: {
    text: {
      header: 'Failed',
      description: 'Transaction did not go through',
    },
    icon: 'circle-x',
    style: {
      badge: `bg-red-500 text-slate-100 border-red-500
      dark:bg-red-500/10 dark:text-red-500`,
      card: 'border-red-600 bg-red-50 dark:bg-red-600/10',
      icon: 'bg-red-200 text-red-600 dark:bg-red-500/20',
      radio: 'border-red-600',
      text: 'text-red-600',
    },
  },
  CANCELED: {
    text: {
      header: 'Canceled',
      description: 'Manually cancelled by the user',
    },
    icon: 'circle-minus',
    style: {
      badge: `bg-slate-500 text-slate-100 border-slate-500
      dark:bg-slate-500/10 dark:text-slate-400`,
      card: 'border-slate-600 bg-slate-50 dark:bg-slate-600/10',
      icon: 'bg-slate-200 text-slate-600 dark:bg-slate-500/20',
      radio: 'border-slate-500',
      text: 'text-slate-500 ',
    },
  },
} as const;

export const TRANSACTION_CATEGORIES_CONFIG = {
  income: {
    text: { header: 'Income', description: 'Salary, wages, freelance' },
    icon: 'income',
    style: {
      badge: `bg-emerald-100 text-emerald-700 border-emerald-200
        dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/40`,
      card: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-600/10',
      icon: 'bg-emerald-200 text-emerald-600 dark:bg-emerald-500/20',
      radio: 'border-emerald-400',
    },
  },
  investments: {
    text: { header: 'Investments', description: 'Stocks, bonds, dividends' },
    icon: 'investments',
    style: {
      badge: `bg-blue-100 text-blue-700 border-blue-300
        dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/40`,
      card: 'border-blue-500 bg-blue-50 dark:bg-blue-600/10',
      icon: 'bg-blue-200 text-blue-600 dark:bg-blue-500/20',
      radio: 'border-blue-500',
    },
  },
  prize: {
    text: { header: 'Prize', description: 'Lottery, contests, gifts' },
    icon: 'prize',
    style: {
      badge: `bg-yellow-100 text-yellow-700 border-yellow-200
        dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/40`,
      card: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-600/10',
      icon: 'bg-yellow-200 text-yellow-600 dark:bg-yellow-500/20',
      radio: 'border-yellow-400',
    },
  },
  currency_exchange: {
    text: {
      header: 'Currency Exchange',
      description: 'Forex, crypto, exchange',
    },
    icon: 'currency-exchange',
    style: {
      badge: `bg-amber-100 text-amber-700 border-amber-200
        dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/40`,
      card: 'border-amber-400 bg-amber-50 dark:bg-amber-600/10',
      icon: 'bg-amber-200 text-amber-600 dark:bg-amber-500/20',
      radio: 'border-amber-400',
    },
  },
  advertisement: {
    text: {
      header: 'Advertisement',
      description: 'Promotions, ads, marketing',
    },
    icon: 'advertisement',
    style: {
      badge: `bg-orange-100 text-orange-700 border-orange-200
        dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/40`,
      card: 'border-orange-400 bg-orange-50 dark:bg-orange-600/10',
      icon: 'bg-orange-200 text-orange-600 dark:bg-orange-500/20',
      radio: 'border-orange-400',
    },
  },
  appliance: {
    text: { header: 'Appliance', description: 'Home devices, electronics' },
    icon: 'appliance',
    style: {
      badge: `bg-cyan-100 text-cyan-700 border-cyan-300
        dark:bg-cyan-500/20 dark:text-cyan-400 dark:border-cyan-500/40`,
      card: 'border-cyan-500 bg-cyan-50 dark:bg-cyan-600/10',
      icon: 'bg-cyan-200 text-cyan-600 dark:bg-cyan-500/20',
      radio: 'border-cyan-500',
    },
  },
  books: {
    text: { header: 'Books', description: 'Books, e-books, magazines' },
    icon: 'books',
    style: {
      badge: `bg-indigo-100 text-indigo-700 border-indigo-300
        dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/40`,
      card: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-600/10',
      icon: 'bg-indigo-200 text-indigo-600 dark:bg-indigo-500/20',
      radio: 'border-indigo-500',
    },
  },
  cafe: {
    text: { header: 'Cafe', description: 'Coffee, snacks, cafes' },
    icon: 'cafe',
    style: {
      badge: `bg-rose-100 text-rose-700 border-rose-200
        dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/40`,
      card: 'border-rose-400 bg-rose-50 dark:bg-rose-600/10',
      icon: 'bg-rose-200 text-rose-600 dark:bg-rose-500/20',
      radio: 'border-rose-400',
    },
  },
  car: {
    text: { header: 'Car', description: 'Car payments, maintenance' },
    icon: 'car',
    style: {
      badge: `bg-sky-100 text-sky-700 border-sky-300
        dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/40`,
      card: 'border-sky-500 bg-sky-50 dark:bg-sky-600/10',
      icon: 'bg-sky-200 text-sky-600 dark:bg-sky-500/20',
      radio: 'border-sky-500',
    },
  },
  clothes: {
    text: { header: 'Clothes', description: 'Clothing, shoes, accessories' },
    icon: 'clothes',
    style: {
      badge: `bg-pink-100 text-pink-700 border-pink-200
        dark:bg-pink-500/20 dark:text-pink-400 dark:border-pink-500/40`,
      card: 'border-pink-400 bg-pink-50 dark:bg-pink-600/10',
      icon: 'bg-pink-200 text-pink-600 dark:bg-pink-500/20',
      radio: 'border-pink-400',
    },
  },
  delivery: {
    text: { header: 'Delivery', description: 'Courier, shipping, postal' },
    icon: 'delivery',
    style: {
      badge: `bg-teal-100 text-teal-700 border-teal-200
        dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/40`,
      card: 'border-teal-400 bg-teal-50 dark:bg-teal-600/10',
      icon: 'bg-teal-200 text-teal-600 dark:bg-teal-500/20',
      radio: 'border-teal-400',
    },
  },
  donations: {
    text: { header: 'Donations', description: 'Charity, donations, tips' },
    icon: 'donations',
    style: {
      badge: `bg-violet-100 text-violet-700 border-violet-200
        dark:bg-violet-500/20 dark:text-violet-400 dark:border-violet-500/40`,
      card: 'border-violet-400 bg-violet-50 dark:bg-violet-600/10',
      icon: 'bg-violet-200 text-violet-600 dark:bg-violet-500/20',
      radio: 'border-violet-400',
    },
  },
  electricity: {
    text: { header: 'Electricity', description: 'Power bills, energy' },
    icon: 'electricity',
    style: {
      badge: `bg-lime-100 text-lime-700 border-lime-200
        dark:bg-lime-500/20 dark:text-lime-400 dark:border-lime-500/40`,
      card: 'border-lime-400 bg-lime-50 dark:bg-lime-600/10',
      icon: 'bg-lime-200 text-lime-600 dark:bg-lime-500/20',
      radio: 'border-lime-400',
    },
  },
  entertainment: {
    text: { header: 'Entertainment', description: 'Events, games, hobbies' },
    icon: 'entertainment',
    style: {
      badge: `bg-purple-100 text-purple-700 border-purple-200
        dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/40`,
      card: 'border-purple-400 bg-purple-50 dark:bg-purple-600/10',
      icon: 'bg-purple-200 text-purple-600 dark:bg-purple-500/20',
      radio: 'border-purple-400',
    },
  },
  flowers: {
    text: { header: 'Flowers', description: 'Flowers, plants, gifts' },
    icon: 'flowers',
    style: {
      badge: `bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200
        dark:bg-fuchsia-500/20 dark:text-fuchsia-400 dark:border-fuchsia-500/40`,
      card: 'border-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-600/10',
      icon: 'bg-fuchsia-200 text-fuchsia-600 dark:bg-fuchsia-500/20',
      radio: 'border-fuchsia-400',
    },
  },
  gas: {
    text: { header: 'Gas', description: 'Fuel, gas station' },
    icon: 'gas',
    style: {
      badge: `bg-red-100 text-red-700 border-red-200
        dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/40`,
      card: 'border-red-400 bg-red-50 dark:bg-red-600/10',
      icon: 'bg-red-200 text-red-600 dark:bg-red-500/20',
      radio: 'border-red-400',
    },
  },
  groceries: {
    text: { header: 'Groceries', description: 'Food and household' },
    icon: 'groceries',
    style: {
      badge: `bg-green-100 text-green-700 border-green-200
        dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/40`,
      card: 'border-green-400 bg-green-50 dark:bg-green-600/10',
      icon: 'bg-green-200 text-green-600 dark:bg-green-500/20',
      radio: 'border-green-400',
    },
  },
  healthcare: {
    text: { header: 'Healthcare', description: 'Doctor, medicine, clinic' },
    icon: 'healthcare',
    style: {
      badge: `bg-emerald-100 text-emerald-700 border-emerald-300
        dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/40`,
      card: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-600/10',
      icon: 'bg-emerald-200 text-emerald-600 dark:bg-emerald-500/20',
      radio: 'border-emerald-500',
    },
  },
  insurance: {
    text: { header: 'Insurance', description: 'Health, car, home insurance' },
    icon: 'insurance',
    style: {
      badge: `bg-blue-100 text-blue-700 border-blue-300
        dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/40`,
      card: 'border-blue-600 bg-blue-50 dark:bg-blue-600/10',
      icon: 'bg-blue-200 text-blue-600 dark:bg-blue-500/20',
      radio: 'border-blue-600',
    },
  },
  internet: {
    text: { header: 'Internet', description: 'Internet, cable, streaming' },
    icon: 'internet',
    style: {
      badge: `bg-cyan-100 text-cyan-700 border-cyan-300
        dark:bg-cyan-500/20 dark:text-cyan-400 dark:border-cyan-500/40`,
      card: 'border-cyan-600 bg-cyan-50 dark:bg-cyan-600/10',
      icon: 'bg-cyan-200 text-cyan-600 dark:bg-cyan-500/20',
      radio: 'border-cyan-600',
    },
  },
  jewelry: {
    text: { header: 'Jewelry', description: 'Jewelry, watches, luxury' },
    icon: 'jewelry',
    style: {
      badge: `bg-yellow-100 text-yellow-700 border-yellow-300
        dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/40`,
      card: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-600/10',
      icon: 'bg-yellow-200 text-yellow-600 dark:bg-yellow-500/20',
      radio: 'border-yellow-500',
    },
  },
  loan: {
    text: { header: 'Loan', description: 'Loan payments, debt' },
    icon: 'loan',
    style: {
      badge: `bg-red-100 text-red-700 border-red-300
        dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/40`,
      card: 'border-red-500 bg-red-50 dark:bg-red-600/10',
      icon: 'bg-red-200 text-red-600 dark:bg-red-500/20',
      radio: 'border-red-500',
    },
  },
  mobile_phone: {
    text: { header: 'Mobile Phone', description: 'Phone bills, subscriptions' },
    icon: 'mobile-phone',
    style: {
      badge: `bg-indigo-100 text-indigo-700 border-indigo-300
        dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/40`,
      card: 'border-indigo-600 bg-indigo-50 dark:bg-indigo-600/10',
      icon: 'bg-indigo-200 text-indigo-600 dark:bg-indigo-500/20',
      radio: 'border-indigo-600',
    },
  },
  movies: {
    text: { header: 'Movies', description: 'Cinema, streaming, shows' },
    icon: 'movies',
    style: {
      badge: `bg-purple-100 text-purple-700 border-purple-300
        dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/40`,
      card: 'border-purple-500 bg-purple-50 dark:bg-purple-600/10',
      icon: 'bg-purple-200 text-purple-600 dark:bg-purple-500/20',
      radio: 'border-purple-500',
    },
  },
  others: {
    text: { header: 'Others', description: 'Miscellaneous expenses' },
    icon: 'others',
    style: {
      badge: `bg-amber-100 text-amber-700 border-amber-300
        dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/40`,
      card: 'border-amber-500 bg-amber-50 dark:bg-amber-600/10',
      icon: 'bg-amber-200 text-amber-600 dark:bg-amber-500/20',
      radio: 'border-amber-500',
    },
  },
  personal_care: {
    text: { header: 'Personal Care', description: 'Haircut, beauty, hygiene' },
    icon: 'personal-care',
    style: {
      badge: `bg-pink-100 text-pink-700 border-pink-300
        dark:bg-pink-500/20 dark:text-pink-400 dark:border-pink-500/40`,
      card: 'border-pink-500 bg-pink-50 dark:bg-pink-600/10',
      icon: 'bg-pink-200 text-pink-600 dark:bg-pink-500/20',
      radio: 'border-pink-500',
    },
  },
  pet_care: {
    text: { header: 'Pet Care', description: 'Vet, food, grooming' },
    icon: 'pet-care',
    style: {
      badge: `bg-orange-100 text-orange-700 border-orange-300
        dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/40`,
      card: 'border-orange-500 bg-orange-50 dark:bg-orange-600/10',
      icon: 'bg-orange-200 text-orange-600 dark:bg-orange-500/20',
      radio: 'border-orange-500',
    },
  },
  repair: {
    text: { header: 'Repair', description: 'Home, car, appliance repair' },
    icon: 'repair',
    style: {
      badge: `bg-teal-100 text-teal-700 border-teal-300
        dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/40`,
      card: 'border-teal-500 bg-teal-50 dark:bg-teal-600/10',
      icon: 'bg-teal-200 text-teal-600 dark:bg-teal-500/20',
      radio: 'border-teal-500',
    },
  },
  sport: {
    text: { header: 'Sport', description: 'Gym, sports, fitness' },
    icon: 'sport',
    style: {
      badge: `bg-green-100 text-green-700 border-green-300
        dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/40`,
      card: 'border-green-500 bg-green-50 dark:bg-green-600/10',
      icon: 'bg-green-200 text-green-600 dark:bg-green-500/20',
      radio: 'border-green-500',
    },
  },
  taxes: {
    text: { header: 'Taxes', description: 'Income, property, sales tax' },
    icon: 'taxes',
    style: {
      badge: `bg-rose-100 text-rose-700 border-rose-300
        dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/40`,
      card: 'border-rose-500 bg-rose-50 dark:bg-rose-600/10',
      icon: 'bg-rose-200 text-rose-600 dark:bg-rose-500/20',
      radio: 'border-rose-500',
    },
  },
  taxi: {
    text: { header: 'Taxi', description: 'Rides, taxis, ridesharing' },
    icon: 'taxi',
    style: {
      badge: `bg-sky-100 text-sky-700 border-sky-300
        dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/40`,
      card: 'border-sky-600 bg-sky-50 dark:bg-sky-600/10',
      icon: 'bg-sky-200 text-sky-600 dark:bg-sky-500/20',
      radio: 'border-sky-600',
    },
  },
  transfer: {
    text: { header: 'Transfer', description: 'Bank transfers, fees' },
    icon: 'transfer',
    style: {
      badge: `bg-violet-100 text-violet-700 border-violet-300
        dark:bg-violet-500/20 dark:text-violet-400 dark:border-violet-500/40`,
      card: 'border-violet-500 bg-violet-50 dark:bg-violet-600/10',
      icon: 'bg-violet-200 text-violet-600 dark:bg-violet-500/20',
      radio: 'border-violet-500',
    },
  },
  travel: {
    text: { header: 'Travel', description: 'Flights, hotels, travel' },
    icon: 'travel',
    style: {
      badge: `bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300
        dark:bg-fuchsia-500/20 dark:text-fuchsia-400 dark:border-fuchsia-500/40`,
      card: 'border-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-600/10',
      icon: 'bg-fuchsia-200 text-fuchsia-600 dark:bg-fuchsia-500/20',
      radio: 'border-fuchsia-500',
    },
  },
  utilities: {
    text: { header: 'Utilities', description: 'Water, gas, utilities' },
    icon: 'utility',
    style: {
      badge: `bg-lime-100 text-lime-700 border-lime-300
        dark:bg-lime-500/20 dark:text-lime-400 dark:border-lime-500/40`,
      card: 'border-lime-500 bg-lime-50 dark:bg-lime-600/10',
      icon: 'bg-lime-200 text-lime-600 dark:bg-lime-500/20',
      radio: 'border-lime-500',
    },
  },
  water: {
    text: { header: 'Water', description: 'Water bills, plumbing' },
    icon: 'water',
    style: {
      badge: `bg-cyan-100 text-cyan-700 border-cyan-300
        dark:bg-cyan-500/20 dark:text-cyan-400 dark:border-cyan-500/40`,
      card: 'border-cyan-700 bg-cyan-50 dark:bg-cyan-600/10',
      icon: 'bg-cyan-200 text-cyan-600 dark:bg-cyan-500/20',
      radio: 'border-cyan-700',
    },
  },
} as const;

export const CREATE_TRANSACTION_FIELDS = {
  TYPE: {
    label: 'Type',
    name: 'transactionType',
  },
  STATUS: {
    label: 'Status',
    name: 'status',
    placeholder: 'Select Status',
  },
  NAME: {
    label: 'Name',
    name: 'transactionName',
    placeholder: 'e.g. Grocery shopping',
  },
  AMOUNT: {
    label: 'Amount',
    name: 'amount',
    placeholder: '0.00',
  },
  CURRENCY: {
    label: 'Currency',
    name: 'currency',
  },
  CATEGORY: {
    label: 'Category',
    name: 'transactionCategory',
    placeholder: 'Search categories...',
  },
  DATE: {
    label: 'Date & Time',
    name: 'createdAt',
  },
  PAYMENT_METHOD: {
    label: 'Payment method',
    name: 'paymentMethod',
    placeholder: 'Select Payment method',
  },
  DESCRIPTION: {
    label: 'Description',
    name: 'description',
    placeholder: 'Add a note for context, receipt number, etc.',
  },
} as const;
