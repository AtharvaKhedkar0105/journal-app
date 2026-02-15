export const createResponse = (success, data = null, message = '', errors = null) => {
  const response = {
    success,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  if (errors !== null) {
    response.errors = errors;
  }

  return response;
};

export const createSuccessResponse = (data, message = 'Success') => {
  return createResponse(true, data, message);
};

export const createErrorResponse = (message, errors = null) => {
  return createResponse(false, null, message, errors);
};
