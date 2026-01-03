import { DataSource, DataSourceOptions } from 'typeorm';

let dbConfig: DataSourceOptions = {
  type: 'sqlite',
  synchronize: false,
  database: 'db.sqlite',
  entities: [],
  migrations: [],
  migrationsRun: false, // Set to true if you want auto-run on app start
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      database: 'db.sqlite',
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/src/migrations/*.js'], // Runtime uses compiled JS
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      database: 'test-db.sqlite',
      entities: ['**/*.entity.ts'],
      migrations: ['src/migrations/*.ts'], // Test can use TS directly
      migrationsRun: true, // Auto-run migrations in production
    });
    break;
  case 'production':
    Object.assign(dbConfig, {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      migrationsRun: true, // Auto-run migrations in production
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/src/migrations/*.js'],
      ssl: {
        rejectUnauthorized: false,
      },
    });
    break;
  default:
    throw new Error('unknown environment');
}

// Export config for NestJS app
export const config = dbConfig;

// Export DataSource for TypeORM CLI (uses TS source files)
const cliConfig: DataSourceOptions = {
  ...dbConfig,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
};

export default new DataSource(cliConfig);
