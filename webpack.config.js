// Notas importanes
// El archivo de configuración debe usar ES5

// Importar un administrador de rutas de archivos
const path = require('path');

// Exportamos un objeto de configuración
// que sera usado por webpack
module.exports = {
  //Modo de empaquetado
  mode: "production",
  // 1. El archivo de entrada o indexador
  entry: "./client/index.js",
  // 2. Especificar el archivo de salida
  output: {
    // 2.1 Ruta absoluta de salida
    path: path.resolve(__dirname, "public"),
    // 2.2 Nombre del archivo de salida
    filename: "bundle.js",
		// 2.3 Ruta base de archivos estaticos
    publicPath: "/"
  },
    //Configuracion de los loaders
    module: {
      rules: [
        //Reglas para archivos JS
        { 
          //Expresion regular para identificar archivos
          test: /\.js$/,
          //Excluir archivos de la carpeta node_modules
          exclude: /node_modules/,
          //Usar el loader de babel
          use: [ 
            {
              loader: "babel-loader",
              //Opciones de configuracion de babel
              options: {
                presets: [
                  [
                    "@babel/preset-env",
                    //Opciones de configuracion de preset-env
                    {
                      "modules": false,
                      "useBuiltIns": "usage",
                      //Corejs para usar polyfills
                      "targets": '> 0.25%, not dead',
                      "corejs": 3
                    }
                  ],
                ]
              }
            }
          ]
        }
      ]
    }
}