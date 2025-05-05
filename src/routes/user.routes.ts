import express, { Router } from 'express';
import { register, login, getAllUser, remove, getProfile, adminLogin } from '../controllers/user.controller';
import { Authenticate } from '../middlewares/authentication.middleware'
import { Role } from '../types/enum';

const userRoutes = express.Router();

userRoutes.post('/register', register);
userRoutes.post('/login',login);
userRoutes.post('/admin/login',adminLogin);

userRoutes.get('/',Authenticate([Role.Admin]),getAllUser)
userRoutes.delete('/:id',Authenticate([Role.Admin]),remove)
userRoutes.get('/profile',Authenticate([Role.User]),getProfile)

export default userRoutes;