const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./util/error-handler');

app.use(express.json());
app.use(morgan('dev'));

const auth = require('./routes/auth');
const fluffs = require('./routes/fluffs');
const tasks = require('./routes/tasks');
const users = require('./routes/users');

app.use('/api/auth', auth);
app.use('/api/fluffs', fluffs);
app.use('/api/tasks', tasks);
app.use('/api/users', users);

app.use(errorHandler());

module.exports = app;
