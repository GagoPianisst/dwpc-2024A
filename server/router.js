import createError from 'http-errors';

// Importing winston logger

import log from './config/winston';

// Importando el enrutador Home

import homeRouter from './domains/home/home.router';

// Funcion que agrega las rutas

const addRoutes = (app) => {
  // Agregando las rutas de Home
  app.use('/', homeRouter);

  // 🚨 ERRORES 🚨

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
  return app;
};

// Exportando la funcion de enrutado

export default { addRoutes };
