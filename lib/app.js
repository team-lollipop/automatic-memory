const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./util/error-handler');
const ensureAuth = require('./util/ensure-auth')();
const ensureRole = require('./util/ensure-role');

app.use(express.json());
app.use(morgan('dev'));

const auth = require('./routes/auth');
const fluffs = require('./routes/fluffs');
const tasks = require('./routes/tasks');
const users = require('./routes/users');

app.use('/api/auth', auth);
app.use('/api/fluffs', ensureAuth, ensureRole('admin'), fluffs);
app.use('/api/tasks', ensureAuth, ensureRole('admin'), tasks);
app.use('/api/users', ensureAuth, users);

app.use(errorHandler());

module.exports = app;
