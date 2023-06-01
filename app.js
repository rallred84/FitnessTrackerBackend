require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const apiRouter = require('./api/index');

// Setup your Middleware and API Router here
app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

module.exports = app;
