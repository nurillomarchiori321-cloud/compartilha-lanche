const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Importação do banco
const sequelize = require('./config/database');

const app = express();

// Configuração de sessão
app.use(session({
  secret: 'compartilha-lanche-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração para servir arquivos estáticos do Bootstrap
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

// ============ ROTAS ============
// Remove as rotas padrão e usa a nossa
app.use('/', require('./routes/index'));


sequelize.authenticate()
  .then(() => console.log(' Conexão com SQLite OK!'))
  .catch(err => console.error(' Erro na conexão:', err));


      console.log(' Tabelas sincronizadas!');
 
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;