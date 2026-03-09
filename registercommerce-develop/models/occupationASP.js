module.exports = (sequelize, DataTypes) => {
  const occupationASP = sequelize.define(
    'occupationASP',
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
      tableName: 'occupationASP',
      freezeTableName: true,
      timestamps: false,
    }
  );

  occupationASP.associate = function associate(models) {
    occupationASP.hasMany(models.legalRepresentative, {
      foreignKey: 'idOccupation',
      as: 'legalRepresentative',
    });
  };
  return occupationASP;
};
