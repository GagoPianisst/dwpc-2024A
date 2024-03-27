// Importando el router de express

import { Router } from 'express';

// Importando el controlador de la home

import homeController from './home.controller';

// Creando una instancia del enrutador

const router = new Router();

// Agregando las rutas

// GET "/"
// GET "/index"
// Get "/home"

router.get(['/', '/home', '/index'], homeController.home);

// Exportando el router

export default router;
