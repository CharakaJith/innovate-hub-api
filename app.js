const express = require('express');
const cors = require('cors');
const Sequelize = require('sequelize');
const logger = require('./middleware/logger/logger');
require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];

const app = express();
app.use(cors());
app.use(express.json());

// Connect to the databse
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

// Import routs
const user = require('./routes/user.routes');

// Setup routing paths
app.use('/api/user', user);

// Start server 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`PORT: ${PORT} | MODE: ${env}`);
});