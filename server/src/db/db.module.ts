import { Global, Module } from '@nestjs/common';
import { Pool, types } from 'pg';

// `created_at` / `updated_at` are `timestamp without time zone` columns holding
// UTC wall-clock values (the Prisma/Next convention). node-postgres otherwise
// parses OID 1114 in the process's LOCAL timezone, shifting every displayed
// time by the local UTC offset. Parse it as UTC so this API returns the same
// instants Prisma/Next do.
types.setTypeParser(1114, (value) =>
  value === null ? null : new Date(value.replace(' ', 'T') + 'Z'),
);

@Global()
@Module({
  providers: [
    {
      provide: 'PG_POOL',
      useFactory: () => {
        return new Pool({
          connectionString: process.env.DATABASE_URL,
        });
      },
    },
  ],
  exports: ['PG_POOL'],
})
export class DatabaseModule {}
