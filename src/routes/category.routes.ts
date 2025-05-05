import express from 'express';
import { create, getByUserId, getById, getAll, update, remove } from '../controllers/category.controller';
import { Authenticate } from '../middlewares/authentication.middleware';
import { Role } from '../types/enum';

const categoryRoutes = express.Router();

// categoryRoutes.post('/create', create);
categoryRoutes.get('/',Authenticate([Role.Admin]), getAll);
categoryRoutes.post('/',Authenticate([Role.User]), create);
categoryRoutes.put('/:id',Authenticate([Role.User]), update);
categoryRoutes.get('/:all/user',Authenticate([Role.User]), getByUserId);
categoryRoutes.get('/:id',Authenticate([Role.User]), getById);
categoryRoutes.delete('/:categoryId',Authenticate([Role.User]), remove);

export default categoryRoutes;