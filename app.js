require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sequelize = require('./config/database');
const createSessionStore = require('./config/session-store');

const app = express();
const sessionSecret = process.env.SESSION_SECRET || 'compartilha-lanche-render-secret';
const sessionOptions = {
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
};

if (!process.env.SESSION_SECRET && process.env.NODE_ENV !== 'test') {
  console.warn('SESSION_SECRET nao definido. Usando segredo padrao temporario.');
}

if (process.env.NODE_ENV !== 'test') {
  sessionOptions.store = createSessionStore(sequelize);
}

app.use(session(sessionOptions));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

app.use('/', require('./routes/index'));

app.ready = sequelize.authenticate()
  .then(() => sequelize.sync())
  .then(() => console.log('Conexao com SQLite OK e tabelas sincronizadas!'));

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  const status = err.status || 500;

  res.locals.message = err.message;
  res.locals.status = status;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(status);
  res.render('error');
});

module.exports = app;
