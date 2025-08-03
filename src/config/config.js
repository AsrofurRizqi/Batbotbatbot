require('dotenv').config();
module.exports = {
  "token": process.env.BOT_TOKEN,
  "development": {
    "use_env_variable": "DATABASE_URL",
    "dialect": process.env.DB_DIALECT
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialect": process.env.DB_DIALECT,
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  }
};