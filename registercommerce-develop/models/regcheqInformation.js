module.exports = (sequelize, DataTypes) => {
  const regcheqInformation = sequelize.define(
    'regcheqInformation',
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
        references: {
          model: 'commerces',
          key: 'id',
        },
        unique: true,
      },
      businessActivity: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      sourceOfIncome: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
      },
      governmentPosition: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
      },
      contractedProduct: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
      },
      channel: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
      },
      riskLevel: {
        type: DataTypes.STRING(45),
        allowNull: true,
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
      tableName: 'regcheqInformation',
      freezeTableName: true,
      timestamps: false,
    },
  );

  regcheqInformation.associate = function associate(models) {
    regcheqInformation.belongsTo(models.commerces, {
      foreignKey: 'idCommerce',
      as: 'commerces',
    });
  };

  return regcheqInformation;
};
