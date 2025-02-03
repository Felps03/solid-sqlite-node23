import { Router } from 'express';

export const userRoutes = (userController) => {
  const router = Router();

  router.post('/', (req, res, next) => userController.createUser(req, res, next));
  router.get('/', (req, res, next) => userController.getUsers(req, res, next));
  router.get('/:id', (req, res, next) => userController.getUser(req, res, next));
  router.put('/:id', (req, res, next) => userController.updateUser(req, res, next));
  router.delete('/:id', (req, res, next) => userController.deleteUser(req, res, next));

  return router;
};
