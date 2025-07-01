import { Router } from 'express';

import { enviarMensaje, obtenerMensaje, marcarMensajeComoVisto} from '../controller/mensajes.controller.js';

const routerMensajes = Router();


routerMensajes.post('/enviarmensaje', enviarMensaje);
routerMensajes.get('/vermensaje', obtenerMensaje);
routerMensajes.put('/visto/:id', marcarMensajeComoVisto);

export default routerMensajes;