/* eslint-disable no-console */
// Preambulo

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

// Importando las rutas
import router from './router';

// Importando la cofiguracion de webpack
import webpackConfig from '../webpack.config';

// Importig winston logger
import log from './config/winston';

// Importing template/engine
import configTemplateEngine from './config/templateEngine';

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
configTemplateEngine(app);

app.use(morgan('dev', { stream: log.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Agregando rutas
router.addRoutes(app);

export default app;
