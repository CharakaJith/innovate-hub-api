const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger/logger');
const authenticate = require('./middleware/auth/authenticate');
const sequelize = require('./config/postgreSQL/server');

require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];

const app = express();
app.use(cors());
app.use(express.json());
app.use(authenticate);

// import routs
const admin = require('./routes/admin.routes');
const user = require('./routes/user.routes');
const product = require('./routes/product.routes');
const team = require('./routes/team.routes');
const meeting = require('./routes/meeting.routes');

// setup routing paths
app.use('/api/admin', admin);
app.use('/api/user', user);
app.use('/api/product', product);
app.use('/api/team', team);
app.use('/api/meeting', meeting);

// start the server 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`PORT: ${PORT} | MODE: ${env}`);
});