import { createSuccessResponse } from '../utils/response.js';

const healthCheck = (req, res) => {
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  };

  res.json(createSuccessResponse(healthData, 'Health check successful'));
};

export {
  healthCheck
};
