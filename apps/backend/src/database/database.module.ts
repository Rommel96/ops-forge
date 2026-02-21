import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

export const KYSELY = 'KYSELY';

@Global()
@Module({
  providers: [
    {
      provide: KYSELY,
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        return new Kysely<any>({
          dialect: new PostgresDialect({
            pool: new Pool({
              connectionString: databaseUrl,
              max: 5,
            }),
          }),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [KYSELY],
})
export class DatabaseModule {}
