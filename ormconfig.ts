import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASWORD,
  database: process.env.MYSQL_DATABASE,
  migrations: ['migrations/**/*.ts'],
  cli: {
    migrationsDir:'migrations',
  },
  logging: true,
};

export = config;