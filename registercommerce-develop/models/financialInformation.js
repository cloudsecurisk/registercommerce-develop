module.exports = (sequelize, DataTypes) => {
  const financialInformation = sequelize.define('financialInformation', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idCommerce: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'commerces',
        key: 'id'
      }
    },
    month1: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    month2: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    month3: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    totalCash: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    totalPos: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    totalEcommerce: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    averagePerMonth: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    averagePerTransaction: {
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
    tableName: 'financialInformation',
    freezeTableName: true,
    timestamps: false
  });

  financialInformation.associate = function associate(models) {
    financialInformation.belongsTo(models.commerces, {
      foreignKey: 'idCommerce',
      as: 'commerce'
    });
  };
  return financialInformation;
};
