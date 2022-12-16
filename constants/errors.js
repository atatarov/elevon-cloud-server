const HTTP_RESPONSE = {
  badRequest: {
    status: 400,
    message: `Invalid data type`,
    absentMessage: {
      noSpace: 'There is not enough space on the disk',
    },
  },
  notFound: {
    status: 404,
    message: 'Invalid URL',
  },
  internalError: { status: 500, message: 'Server error' },
  unauthorized: { status: 401, message: 'You need authorization' },
  forbidden: { status: 403, message: 'Access is denied' },
  conflict: {
    status: 409,
    message: 'Conflict error',
    absentMessage: {
      fileExist: 'File exist',
    },
  },
};

const ERROR_TYPE = {
  cast: 'CastError',
  validity: 'ValidationError',
  fileExist: 'FileExistError',
  internal: 'InteralError',
  notFound: 'NotFoundError',
};

module.exports = { ERROR_TYPE, HTTP_RESPONSE };
