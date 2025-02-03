import express from 'express';
import { createDependencies } from './dependencyInjection.js';
import { userRoutes } from './routes/userRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

export const startServer = async (port = process.env.PORT || 3000) => {
  const { userController } = await createDependencies();

  const app = express();
  app.use(express.json());

  app.use('/users', userRoutes(userController));
  app.use(errorHandler);

  const server = app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });

 
  return server;
};

startServer();
