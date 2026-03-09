module.exports = (sequelize, DataTypes) => {
  const commerces = sequelize.define('commerces', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idAmex: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
    },
    idCommerceStatus: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'commerceStatus',
        key: 'id'
      },
    },
    idCommerceType: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'commerceType',
        key: 'id'
      },
      unique: true
    },
    idLineBusiness: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      references: {
        model: 'lineBusiness',
        key: 'id'
      },
      unique: true
    },
    idLineBusinessASP: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      references: {
        model: 'lineBusinessASP',
        key: 'id'
      },
      unique: true
    },
    // @note: sgs
    idLineBusinessSGS: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      references: {
        model: 'occupationSGS',
        key: 'id'
      },
    },
    idExecutive: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      references: {
        model: 'executives',
        key: 'id'
      },
      unique: true
    },
    idDistributor: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      references: {
        model: 'executives',
        key: 'id'
      },
      unique: true
    },
    idGroup: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      references: {
        model: 'executives',
        key: 'id'
      },
      unique: true
    },
    idWholesaler: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      references: {
        model: 'executives',
        key: 'id'
      },
      unique: true
    },
    idSubDistributor: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      references: {
        model: 'executives',
        key: 'id'
      },
      unique: true
    },
    origen: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    daysInProcess: {
      type: DataTypes.INTEGER(10).UNSIGNED,
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
    },
    stepAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'commerces',
    freezeTableName: true,
    timestamps: false
  });

  commerces.associate = (models) => {
    commerces.hasMany(models.organization, {
      foreignKey: 'idCommerce',
      as: 'organization'
    });
    commerces.hasOne(models.generalInfo, {
      foreignKey: 'idCommerce',
      as: 'generalInfo'
    });

    commerces.hasMany(models.legalRepresentative, {
      foreignKey: 'idCommerce',
      as: 'legalRepresentative'
    });

    commerces.belongsTo(models.commerceType, {
      foreignKey: 'idCommerceType',
      as: 'commerceType'
    });

    commerces.hasMany(models.commerceDocument, {
      foreignKey: 'idCommerce',
      as: 'commerceDocument'
    });
    commerces.hasOne(models.contract, {
      foreignKey: 'idCommerce',
      as: 'contract'
    });
    commerces.hasMany(models.financialInformation, {
      foreignKey: 'idCommerce',
      as: 'financialInformation'
    });
    commerces.belongsTo(models.lineBusiness, {
      foreignKey: 'idLineBusiness',
      as: 'lineBusiness'
    });
    commerces.belongsTo(models.executives, {
      foreignKey: 'idExecutive',
      as: 'commerceExecutive'
    });
    commerces.belongsTo(models.executives, {
      foreignKey: 'idDistributor',
      as: 'commerceDistributor'
    });
    commerces.belongsTo(models.executives, {
      foreignKey: 'idGroup',
      as: 'commerceGroup'
    });
    commerces.belongsTo(models.executives, {
      foreignKey: 'idWholesaler',
      as: 'commerceWholesaler'
    });
    commerces.belongsTo(models.executives, {
      foreignKey: 'idSubDistributor',
      as: 'commerceSubDistributor'
    });
    commerces.belongsTo(models.lineBusinessASP, {
      foreignKey: 'idLineBusinessASP',
      as: 'lineBusinessASP'
    });
    // @note: sgs
    commerces.belongsTo(models.occupationSGS, {
      foreignKey: 'idLineBusinessSGS',
      as: 'lineBusinessSGS'
    });
    commerces.belongsTo(models.commerceStatus, {
      foreignKey: 'idCommerceStatus',
      as: 'commerceStatus'
    });
    commerces.hasMany(models.commerceDocumentV2, {
      foreignKey: 'idCommerce',
      as: 'commerceDocumentV2'
    });
    // @note: reqchegInformation
    commerces.hasOne(models.regcheqInformation, {
      foreignKey: 'idCommerce',
      as: 'regcheqInformation'
    });
  };

  return commerces;
};
