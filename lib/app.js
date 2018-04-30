const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./util/error-handler');

app.use(express.json());
app.use(morgan('dev'));

const auth = require('./routes/auth');
const fluffs = require('./routes/fluffs');

app.use('/api/auth', auth);
app.use('/api/fluffs', fluffs);

app.use(errorHandler());

module.exports = app;
