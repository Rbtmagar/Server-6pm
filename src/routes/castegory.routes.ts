import express from 'express';
import { create } from '../controllers/category.controller.ts';

const router = express.Router();

router.post('/register', create);



export default router;