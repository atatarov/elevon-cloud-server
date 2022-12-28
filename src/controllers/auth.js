const AuthService = require('../services/auth-service');
const { CLIENT_URL } = require('../constants/constants');

const REFRESH_TOKEN_DAYS = 30;

function daysToMilliseconds(days) {
  // hour  min  sec  ms
  return days * 24 * 60 * 60 * 1000;
}

const REFRESH_TOKEN_AGE = daysToMilliseconds(REFRESH_TOKEN_DAYS);

module.exports.registration = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userData = await AuthService.registration(name, email, password);
    res.send({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      isActivated: userData.isActivated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await AuthService.login(email, password);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: REFRESH_TOKEN_AGE,
      httpOnly: true,
    });
    res.send({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      isActivated: userData.isActivated,
      diskSpace: userData.diskSpace,
      usedSpace: userData.usedSpace,
      avatar: userData.avatar,
      accessToken: userData.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.activateAccount = async (req, res, next) => {
  try {
    const activationLink = req.params.link;
    await AuthService.activateAccount(activationLink);
    res.redirect(200, CLIENT_URL);
  } catch (error) {
    next(error);
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    await AuthService.logout(refreshToken);
    res.clearCookie('refreshToken');
    res.send({ message: 'Token was removed' });
  } catch (error) {
    next(error);
  }
};

module.exports.refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const userData = await AuthService.refreshToken(refreshToken);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: REFRESH_TOKEN_AGE,
      httpOnly: true,
    });
    res.send({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      isActivated: userData.isActivated,
      diskSpace: userData.diskSpace,
      usedSpace: userData.usedSpace,
      avatar: userData.avatar,
      accessToken: userData.accessToken,
    });
  } catch (error) {
    next(error);
  }
};
