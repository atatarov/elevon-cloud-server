const TokenService = require('../services/token-service');
const { TOKEN_TYPE } = require('../constants/constants.js');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith(TOKEN_TYPE)) {
    return next(new UnauthorizedError());
  }

  const token = authorization.replace(TOKEN_TYPE, '');

  const userData = TokenService.validateAccessToken(token);
  if (!userData) {
    return next(new UnauthorizedError());
  }

  req.user = userData;
  next();
};
