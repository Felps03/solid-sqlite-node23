import logger from '../logger.js';

const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
  
    const response = {
      message: err.message || 'Erro interno do servidor'
    };
  
    if (process.env.NODE_ENV !== 'production') {
      response.stack = err.stack;
    }
  
    res.status(status).json(response);
  };
  
  export default errorHandler;
  