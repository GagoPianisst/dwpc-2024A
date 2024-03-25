// Importando el core de wintson y la funcion format de winston

import winston, { format } from 'winston';
import appRoot from 'app-root-path';

// Se desestructuran funciones para realizar la composicion de formato

const { combine, timestamp, label, printf, colorize, prettyPrint } = format;

// Se define un esquema de colores segun el grado de severidad

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magneta',
  debug: 'blue',
};

// Agregando el esquema de colores a Winston

winston.addColors(colors);

// === Se crean las plantillas para los formatos ===

// Formato para la consola

const myConsoleFormat = combine(
  // Agregando colores al formato
  colorize({ all: true }),
  // Agregando una etiqueta al log
  label({ label: '🌸' }),
  // Agregando fecha
  timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  // Funcion de impresion
  printf(
    (info) => `${info.level}: ${info.label}: ${info.timestap}: ${info.message}`,
  ),
);

// Formato para los archivos

const myFileFormat = combine(
  // Quitando todo tipo de colorizacion
  format.uncolorize(),
  // Agregando fecha
  timestamp({ format: 'DD-MM-YY HH:mm:ss' }),
  // Estableciendo la salida en formato Json
  prettyPrint(),
);

// Creando el objeto de opciones para cada transporte

const options = {
  infoFile: {
    level: 'info',
    filename: `${appRoot.toString()}/server/logs/info.log`,
    handleExceptions: false,
    maxSize: 5242880, // 5MB
    maxFile: 5,
    format: myFileFormat,
  },
  warnFile: {
    level: 'info',
    filename: `${appRoot.toString()}/server/logs/warn.log`,
    handleExceptions: false,
    maxSize: 5242880, // 5MB
    maxFile: 5,
    format: myFileFormat,
  },
  errorFile: {
    level: 'error',
    filename: `${appRoot.toString()}/server/logs/error.log`,
    handleExceptions: false,
    maxSize: 5242880, // 5MB
    maxFile: 5,
    format: myFileFormat,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    format: myConsoleFormat,
  },
};

// Se crea la instancia logger

const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.infoFile),
    new winston.transports.File(options.warnFile),
    new winston.transports.File(options.errorFile),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false, // No finaliza en excepciones no manejadas
});

/*
Por defecto Morgan envia la salida exclusivamente a la consola, algo asi:
Morgan ---> [logs] ---> consola
Lo que aremos a continuacion sera definir una funcion llamada "write" que sera parte de un objeto que se asignara
a la propiedad stream donde usaremos el nivel informatico para que tanto el transportador archivo como el de consola
tomen el
Morgan ---> [logs] ---> Winston ---> [Logs a transportes informativos]
*/

// Estableciendo un flujo de entrada que servira para interceptar el log de morgan

logger.stream = {
  write(message) {
    logger.info(message);
  },
};

// Exportando el objeto logger

export default logger;
