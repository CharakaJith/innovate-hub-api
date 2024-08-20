const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger/logger');
const auth = require('./middleware/auth/authenticate');
const sequelize = require('./config/postgreSQL/server');

require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];

const app = express();
app.use(cors());
app.use(express.json());
app.use(auth);

// Import routs
const user = require('./routes/user.routes');

// Setup routing paths
app.use('/api/user', user);

// Start server 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`PORT: ${PORT} | MODE: ${env}`);
});