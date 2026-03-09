module.exports = (sequelize, DataTypes) => {
  const commerceStatus = sequelize.define('commerceStatus', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(45),
      allowNull: true
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
  }, {
    tableName: 'commerceStatus',
    freezeTableName: true,
    timestamps: false
  });

  commerceStatus.associate = (models) => {
    commerceStatus.hasOne(models.commerces, {
      foreignKey: 'idCommerceStatus',
      as: 'commerces'
    });
  };
  return commerceStatus;
};
