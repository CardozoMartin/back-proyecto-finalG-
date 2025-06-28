import Router from 'express';
import { login } from '../controller/login.controller.js';

const router = Router();

router.get('/', login)


export default router;