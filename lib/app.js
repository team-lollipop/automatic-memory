const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./util/error-handler');

app.use(express.json());
app.use(morgan('dev'));

const auth = require('./routes/auth');

app.use('/api/auth', auth);

app.use(errorHandler());

module.exports = app;
