export const validateUserInput = (user) => {
    let { name, email } = user;
  
    if (typeof name !== 'string' || name.trim() === '') {
      throw new Error('Nome inválido.');
    }
    if (typeof email !== 'string' || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw new Error('Email inválido.');
    }
  
    return {
      name: name.trim(),
      email: email.trim().toLowerCase(),
    };
  };
  