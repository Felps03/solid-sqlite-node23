import { validateUserInput } from '../validators/userValidator.js';

export class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  createUser(req, res, next) {
    try {
      const validUser = validateUserInput(req.body);
      const newUser = this.userRepository.create(validUser);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  getUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = this.userRepository.getById(id);
      if (!user) return res.status(404).json({ error: 'User not found.' });
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  getUsers(req, res, next) {
    try {
      const users = this.userRepository.getAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const validUser = validateUserInput(req.body);
      const updatedUser = this.userRepository.update(id, validUser);
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const success = this.userRepository.delete(id);
      if (success) {
        res.json({ message: 'User removed.' });
      } else {
        res.status(404).json({ error: 'User not found.' });
      }
    } catch (error) {
      next(error);
    }
  }
}
