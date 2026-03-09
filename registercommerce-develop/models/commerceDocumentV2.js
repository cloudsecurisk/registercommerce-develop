module.exports = (sequelize, DataTypes) => {
  const commerceDocumentV2 = sequelize.define('commerceDocumentV2', {
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
    idDocumentType: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'documentType',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    observations: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    verifiedByIA: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    viewed: {
      type: DataTypes.BOOLEAN,
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
  }, {
    tableName: 'commerceDocumentV2',
    freezeTableName: true,
    timestamps: false
  });

  commerceDocumentV2.associate = function associate(models) {
    commerceDocumentV2.belongsTo(models.commerces, {
      foreignKey: 'idCommerce',
      as: 'commerce'
    });
    commerceDocumentV2.belongsTo(models.commerceDocumentType, {
      foreignKey: 'idDocumentType',
      as: 'documentType'
    });
  };

  return commerceDocumentV2;
};
