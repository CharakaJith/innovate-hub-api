const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const env = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`PORT: ${PORT} | MODE: ${env}`);
});