import Router from 'express';
import { login } from '../controller/login.controller.js';

const router = Router();

router.post('/', login)


export default router;