module.exports = (sequelize, DataTypes) => {
  const commerceType = sequelize.define('commerceType', {
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
      type: DataTypes.STRING(200),
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
    tableName: 'commerceType',
    freezeTableName: true,
    timestamps: false
  });

  commerceType.associate = function associate(models) {
    commerceType.hasMany(models.commerces, {
      foreignKey: 'idCommerceType',
      as: 'commerces'
    });
  };
  return commerceType;
};
