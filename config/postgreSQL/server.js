const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config')[env];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: process.env.PG_HOST,
      dialect: config.dialect,
      pool: {
        max: parseInt(process.env.PG_MAXCONN),
        min: 0,
        acquire: 60000,
        idle: 10000,
      },
    }
); 

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        logger('error', false, 503, `Unable to connect to the database: ${error}`);
        console.error(`Unable to connect to the database: ${error}`);
        process.exit();
    });

module.exports = sequelize;