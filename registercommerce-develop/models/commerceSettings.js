module.exports = (sequelize, DataTypes) => {
  const commerceSettings = sequelize.define(
    'commerceSettings',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      idCommerce: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
      },
      recordSubmissionFileAmex: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: 'commerceSettings',
      freezeTableName: true,
      timestamps: false,
    }
  );

  return commerceSettings;
};
