import { DataSource, DataSourceOptions } from 'typeorm';

// Base config for NestJS app (without migrations)
let appConfig: DataSourceOptions = {
  type: 'sqlite',
  synchronize: false,
  database: 'db.sqlite',
  entities: [],
};

// Config for TypeORM CLI (with migrations)
let cliConfig: DataSourceOptions = {
  type: 'sqlite',
  synchronize: false,
  database: 'db.sqlite',
  migrations: ['src/migrations/*.ts'],
  entities: [],
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(appConfig, {
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
    });
    Object.assign(cliConfig, {
      database: 'db.sqlite',
      entities: ['src/**/*.entity.ts'],
    });
    break;
  case 'test':
    Object.assign(appConfig, {
      database: 'test-db.sqlite',
      entities: ['**/*.entity.ts'],
    });
    Object.assign(cliConfig, {
      database: 'test-db.sqlite',
      entities: ['src/**/*.entity.ts'],
    });
    break;
  case 'production':
    // Add production config here
    break;
  default:
    throw new Error('unknown environment');
}

// Export config for NestJS app (NO migrations - they're already applied)
export const config = appConfig;

// Export DataSource for TypeORM CLI (WITH migrations)
export default new DataSource(cliConfig);
