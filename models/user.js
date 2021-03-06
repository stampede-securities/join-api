module.exports = function defineUser(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    refCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAccount: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    signUpRefCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })

  return User
}
