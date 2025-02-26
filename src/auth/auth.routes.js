import { Router } from 'express';
import { login } from './auth.controller.js'
import { deleteFileOnError } from '../middlewares/delete-file-on-error.js';

const router = Router();

router.post(
    '/login',
    deleteFileOnError,
    login
);

export default router;