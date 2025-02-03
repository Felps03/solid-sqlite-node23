import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  dbFile: process.env.DB_FILE || 'database.sqlite',
  nodeEnv: process.env.NODE_ENV || 'development'
};
