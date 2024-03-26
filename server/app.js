/* eslint-disable no-console */
// Preambulo
// Ayuda a manejar errores http
import createError from 'http-errors';
// Ayuda a crear servidores web
import express from 'express';
// Nucleo de node, ayuda al manejo de las rutas
import path from 'path';
// Ayuda al manejo de coockies
import cookieParser from 'cookie-parser';
// Maneja el log de peticion http
import morgan from 'morgan';

// Importando las dependencias de webpack
import webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import usersRouter from './routes/users';
import indexRouter from './routes/index';
// Importando la cofiguracion de webpack
import webpackConfig from '../webpack.config';

// Importig winston logger
import log from './config/winston';

const app = express();

// Obteniendo el modo de ejecucion de la app
const nodeEnvironment = process.env.NODE_ENV || 'development';

// Configurando el entorno de desarrollo
if (nodeEnvironment === 'development') {
  console.log('🛠️ Ejecutando en modo de desarrollo');
  // Agregando el modo de configuracion a la ejecucion
  webpackConfig.mode = 'development';
  // Estableciendo el valor del puerto del servidor de desarrollo.
  webpackConfig.devServer.port = process.env.PORT || 8080;
  // Configurando el HMR (Hot Module Replacement)
  webpackConfig.entry = [
    'webpack-hot-middleware/client?reload=true&timeout=1000',
    webpackConfig.entry,
  ];

  // Agregar el plugin a la configuracion de desarrollo de webpack
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  // Generando el empaquetado (bundle) de webpack
  const bundle = webpack(webpackConfig);
  // Agregando el middleware de webpack
  app.use(
    WebpackDevMiddleware(bundle, {
      publicPath: webpackConfig.output.publicPath,
    }),
  );
  // Agregando el middleware HMR
  app.use(WebpackHotMiddleware(bundle));
} else {
  console.log('🚀 Ejecutando en modo produccion');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(morgan('dev', { stream: log.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  log.info(`404 Pagina no encontrada 🐷 ${req.method} ${req.originalUrl}`);
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
