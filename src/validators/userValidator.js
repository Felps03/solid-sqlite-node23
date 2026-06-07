export const validateUserInput = (user) => {
    let { name, email } = user;
  
    if (typeof name !== 'string' || name.trim() === '') {
      const error = new Error('Nome inválido.');
      error.status = 400;
      throw error;
    }
    if (typeof email !== 'string' || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      const error = new Error('Email inválido.');
      error.status = 400;
      throw error;
    }
  
    return {
      name: name.trim(),
      email: email.trim().toLowerCase(),
    };
  };
  