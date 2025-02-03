import { connectDB } from './config/database.js';
import { UserRepository } from './repositories/UserRepository.js';
import { UserController } from './controllers/UserController.js';

let dependencies = null;

export const createDependencies = async () => {
  if (dependencies) return dependencies;

  const db = connectDB();
  const userRepository = new UserRepository(db);
  const userController = new UserController(userRepository);
  dependencies = { db, userRepository, userController };
  return dependencies;
};
