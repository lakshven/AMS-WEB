export default (sequelize, DataTypes) => {
  return sequelize.define('PasswordReset', {
    email: DataTypes.STRING,
    token: DataTypes.STRING,
    expiry: DataTypes.BIGINT,
  });
};