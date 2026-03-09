module.exports = (sequelize, DataTypes) => {
  const onboarding = sequelize.define('onboarding', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idUser: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    idCommerce: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    registrationProcess: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    commerceTypeSelected: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    readQuickGuide: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    uploadedDocuments: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    docsHaveIncidents: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    fieldsCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    contractCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    steeCards: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    mposEcommerce: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    accountType: {
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
    tableName: 'onboarding',
    freezeTableName: true,
    timestamps: false
  });

  return onboarding;
};
