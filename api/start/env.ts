/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for Geo Services
  |----------------------------------------------------------
  */
  GEO_NOMINATIM_URL: Env.schema.string(),
  GEO_VALHALLA_URL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for Moneroo
  |----------------------------------------------------------
  */
  MONEROO_SECRET_KEY: Env.schema.string(),
  MONEROO_WEBHOOK_SECRET: Env.schema.string(),

  BACKEND_URL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for S3 (Garage)
  |----------------------------------------------------------
  */
  S3_ENDPOINT: Env.schema.string(),
  S3_REGION: Env.schema.string(),
  S3_ACCESS_KEY: Env.schema.string(),
  S3_SECRET_KEY: Env.schema.string(),
  S3_BUCKET: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for Frontend
  |----------------------------------------------------------
  */
  FRONTEND_URL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for httpSMS (Self-Hosted)
  |----------------------------------------------------------
  */
  HTTPSMS_API_URL: Env.schema.string.optional(),
  HTTPSMS_API_KEY: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for Redis
  |----------------------------------------------------------
  */
  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),
})
