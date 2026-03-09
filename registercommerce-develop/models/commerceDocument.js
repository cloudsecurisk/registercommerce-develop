module.exports = (sequelize, DataTypes) => {
  const commerceDocument = sequelize.define('commerceDocument', {
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
    constitutiveAct: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    proofBC: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    accountStatement: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    proofAddress: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    legalOwnerIdentification: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    proofFiscalSituation: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    SATComplianceOpinion: {
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
    tableName: 'commerceDocument',
    freezeTableName: true,
    timestamps: false
  });

  commerceDocument.associate = function associate(models) {
    commerceDocument.belongsTo(models.commerces, {
      foreignKey: 'idCommerce',
      as: 'commerce'
    });
  };
  return commerceDocument;
};
