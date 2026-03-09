module.exports = {
  dev: {
    username: 'root',
    password: '12345',
    database: 'registercommerce',
    host: 'register-commerce-db',
    dialect: 'mysql',
    multipleStatements: true,
    logging: true
  },
  production: {
    username: process.env.DB_API_USER_COMMERCE,
    password: process.env.DB_API_PASSWORD_COMMERCE,
    database: process.env.DB_API_SCHEMA_COMMERCE,
    host: process.env.DB_API_HOST_COMMERCE,
    dialect: 'mysql',
    logging: false,
    replication: {
      read: [
        {
          host: process.env.DB_HOST,
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          dialectOptions: {
            ssl: {
              ca: process.env.COMMERCE_DB_CA_PRD,
              cert: process.env.COMMERCE_DB_CERT_PRD,
              key: process.env.COMMERCE_DB_PRIVATE_KEY_PRD
            }
          }
        }
      ],
      write: {
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        dialectOptions: {
          ssl: {
            ca: process.env.COMMERCE_DB_CA_PRD,
            cert: process.env.COMMERCE_DB_CERT_PRD,
            key: process.env.COMMERCE_DB_PRIVATE_KEY_PRD
          }
        }
      }
    }
  },
  staging: {
    username: process.env.DB_API_USER_COMMERCE,
    password: process.env.DB_API_PASSWORD_COMMERCE,
    database: process.env.DB_API_SCHEMA_COMMERCE,
    host: process.env.DB_API_HOST_COMMERCE,
    dialect: 'mysql',
    logging: false,
    replication: {
      read: [
        {
          host: process.env.DB_HOST,
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          dialectOptions: {
            ssl: {
              ca: process.env.COMMERCE_DB_CA_PRD,
              cert: process.env.COMMERCE_DB_CERT_PRD,
              key: process.env.COMMERCE_DB_PRIVATE_KEY_PRD
            }
          }
        }
      ],
      write: {
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        dialectOptions: {
          ssl: {
            ca: process.env.COMMERCE_DB_CA_PRD,
            cert: process.env.COMMERCE_DB_CERT_PRD,
            key: process.env.COMMERCE_DB_PRIVATE_KEY_PRD
          }
        }
      }
    }
  },
};
