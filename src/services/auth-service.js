const bcrypt = require('bcrypt');
const Uuid = require('uuid');

const { API_URL } = require('../constants/constants');
const { ERROR_TYPE } = require('../constants/errors');
const ConflictError = require('../errors/conflict-error');
const File = require('../models/file');
const FileService = require('../services/file-service');
const ForbiddenError = require('../errors/forbidden-error');
const { HTTP_RESPONSE } = require('../constants/errors');
const MailService = require('../services/mail-service');
const NotFoundError = require('../errors/not-found-error');
const TokenService = require('../services/token-service');
const UnauthorizedError = require('../errors/unauthorized-error');
const User = require('../models/user');
const UserDto = require('../dtos/user-dto');
const UserDataDto = require('../dtos/user-data-dto');
const BadRequestError = require('../errors/bad-request-error');

const registration = async (name, email, password) => {
  try {
    const candidate = await User.findOne({ email });
    if (candidate) {
      throw new ConflictError(HTTP_RESPONSE.conflict.absentMessage.userExist);
    }

    const hash = await bcrypt.hash(password, 10);
    const activationLink = Uuid.v4();
    const user = await User.create({
      name,
      email,
      password: hash,
      activationLink,
    });

    const activationUri = `${API_URL}/activate/${activationLink}`;

    await MailService.sendActivationMail(email, activationUri);

    const userDataDto = new UserDataDto(user);

    return { ...userDataDto };
  } catch (error) {
    switch (error.name) {
      case ERROR_TYPE.validity:
        throw new BadRequestError();
      case ERROR_TYPE.cast:
        throw new BadRequestError();
      default:
        throw error;
    }
  }
};

const login = async (email, password) => {
  try {
    const user = await User.findUserByCredentials(email, password);

    if (!user.isActivated) {
      throw new ForbiddenError(
        HTTP_RESPONSE.forbidden.absentMessage.noActivation
      );
    }

    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({
      ...userDto,
    });
    await TokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

    const userDataDto = new UserDataDto(user);

    return { ...tokens, ...userDataDto };
  } catch (error) {
    throw error;
  }
};

const activateAccount = async (activationLink) => {
  try {
    const user = await User.findOne({ activationLink });
    if (!user) {
      throw new NotFoundError();
    }

    if (user.isActivated) {
      throw new BadRequestError();
    }

    user.activationLink = '';
    user.isActivated = true;

    const file = await File.create({
      user: user._id,
      name: 'author',
      type: 'dir',
      parent: user._id,
    });
    await FileService.createDir(file);

    await user.save();
    const userDto = new UserDto(user);
    return userDto;
  } catch (error) {
    if (error.name === ERROR_TYPE.fileExist) {
      throw new ConflictError(HTTP_RESPONSE.conflict.absentMessage.fileExist);
    }
    throw error;
  }
};

const logout = async (refreshToken) => {
  try {
    await TokenService.removeRefreshToken(refreshToken);
    return true;
  } catch (error) {
    throw error;
  }
};

const refreshToken = async (token) => {
  if (!token) {
    throw new UnauthorizedError();
  }
  try {
    const userData = TokenService.validateRefreshToken(token);
    const tokenFromDb = await TokenService.findToken(token);
    if (!userData || !tokenFromDb) {
      throw new UnauthorizedError();
    }
    const user = await User.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({
      ...userDto,
      origin: tokenFromDb._id,
    });
    await TokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

    const userDataDto = new UserDataDto(user);
    return { ...tokens, ...userDataDto };
  } catch (error) {
    throw error;
  }
};

module.exports = { registration, login, activateAccount, logout, refreshToken };
