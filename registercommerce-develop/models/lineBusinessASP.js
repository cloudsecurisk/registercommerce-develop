module.exports = (sequelize, DataTypes) => {
  const lineBusinessASP = sequelize.define(
    'lineBusinessASP',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      code: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
      },
      activity: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'lineBusinessASP',
      freezeTableName: true,
      timestamps: false,
    }
  );

  lineBusinessASP.associate = function associate(models) {
    lineBusinessASP.hasMany(models.commerces, {
      foreignKey: 'idLineBusinessASP',
      as: 'commerces',
    });
  };
  return lineBusinessASP;
};
