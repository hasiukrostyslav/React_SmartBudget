// .cjs so we can resolve plugin paths via require.resolve. This matters when
// prettier is invoked from a CWD other than this folder (e.g. the VS Code
// Prettier extension running from the repo root). Without explicit paths,
// prettier walks node_modules from the CWD and fails to find these plugins.
//
// require.resolve from THIS file's location returns the absolute path to the
// plugin's main entry, sidestepping ESM "directory import not supported"
// errors that occur when only the package dir is provided.
const resolveLocal = (name) => require.resolve(name, { paths: [__dirname] });

/** @type {import('prettier').Config} */
module.exports = {
  plugins: [
    resolveLocal('@ianvs/prettier-plugin-sort-imports'),
    resolveLocal('prettier-plugin-tailwindcss'),
  ],
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  importOrder: [
    '^react$',
    '^react-dom(.*)$',
    '',
    '^next(.*)$',
    '^next-auth(.*)$',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/types/(.*)$',
    '',
    '^@/routes(.*)$',
    '^@/auth/(.*)$',
    '^@/lib/(.*)$',
    '^@/hooks/(.*)$',
    '^@/context/(.*)$',
    '',
    '^@/components/(.*)$',
    '',
    '^[./]',
  ],
};
