// Mirror of the production tables, taken from information_schema on the live
// database (the real schema lives in the Next/Prisma app). Idempotent so the
// test harness can apply it on every run.
export const TEST_SCHEMA_SQL = `
DO $$ BEGIN
  CREATE TYPE "Currency" AS ENUM ('EUR','GBP','HUF','PLN','UAH','USD');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "TransactionType" AS ENUM ('Expenses','Income');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "TransactionStatus" AS ENUM ('CANCELED','COMPLETED','FAILED','PENDING');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "TransactionCategory" AS ENUM (
    'advertisement','appliance','books','cafe','car','clothes','currency exchange',
    'delivery','donations','electricity','entertainment','flowers','gas','groceries',
    'healthcare','income','insurance','internet','investments','jewelry','loan',
    'mobile phone','movies','others','personal care','pet care','prize','repair',
    'sport','taxes','taxi','transfer','travel','utilities','water'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "users" (
  id             text PRIMARY KEY,
  name           text,
  email          text NOT NULL,
  email_verified timestamp,
  image          text,
  password       text,
  created_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "transactions" (
  transaction_id       text PRIMARY KEY,
  user_id              text NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
  transaction_name     text NOT NULL,
  transaction_category "TransactionCategory" NOT NULL,
  payment_method       text NOT NULL,
  transaction_type     "TransactionType" NOT NULL,
  currency             "Currency" NOT NULL,
  amount               double precision NOT NULL,
  description          text,
  status               "TransactionStatus" NOT NULL DEFAULT 'COMPLETED',
  created_at           timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;
