const HTTP_RESPONSE = {
  badRequest: {
    status: 400,
    message: `Invalid data type`,
  },
  notFound: {
    status: 404,
    message: 'Invalid URL',
  },
  internalError: { status: 500, message: 'Server error' },
  unauthorized: { status: 401, message: 'You need authorization' },
  forbidden: { status: 403, message: 'Access is denied' },
};

const ERROR_TYPE = {
  cast: 'CastError',
  validity: 'ValidationError',
};

module.exports = { ERROR_TYPE, HTTP_RESPONSE };
