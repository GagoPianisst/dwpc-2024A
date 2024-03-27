//  Se importa el objeto "engine" y se renombra como "exphbs"

import { engine as exphbs } from 'express-handlebars';
import path from 'path';

// Configuracion del motor de plantillas

export default (app) => {
  // Registra el motor de plantillas
  app.engine(
    'hbs',
    exphbs({
      // Define la extension de los archivos de plantilla
      extname: '.hbs',
      // Define el nombre del layout principal
      defaultLayout: 'main',
    }),
  );

  // Establece el motor de plantillas

  app.set('view engine', 'hbs');

  // Establece la ruta de las vistas

  app.set('views', path.join(__dirname, '..', 'views'));

  return app;
};
