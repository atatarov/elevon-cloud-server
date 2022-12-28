module.exports = class UserDataDto {
  id;
  name;
  email;
  isActivated;
  diskSpace;
  usedSpace;
  avatar;

  constructor(model) {
    this.id = model._id;
    this.name = model.name;
    this.email = model.email;
    this.isActivated = model.isActivated;
    this.diskSpace = model.diskSpace;
    this.usedSpace = model.usedSpace;
    this.avatar = model.avatar;
  }
};
