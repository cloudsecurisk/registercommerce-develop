module.exports = (sequelize, DataTypes) => {
  const generalInfo = sequelize.define('generalInfo', {
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
      },
      unique: true
    },
    idPerson: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    notaryCity: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      references: {
        model: 'cities',
        key: 'id'
      },
      unique: true
    },
    idAddress: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      references: {
        model: 'addresses',
        key: 'id'
      },
      unique: true
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    commerceName: {
      type: DataTypes.STRING(45),
      allowNull: true,
      unique: true
    },
    rfc: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    socialReason: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contract: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    webPage: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    actNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    registrationDate: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    notaryNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    nameOfTheNotary: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    numeroCatastro: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    electronicSignatureSerialNumber: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    actDate: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    latitude: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
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
    tableName: 'generalInfo',
    freezeTableName: true,
    timestamps: false
  });

  generalInfo.associate = function associate(models) {
    generalInfo.belongsTo(models.addresses, {
      foreignKey: 'idAddress',
      as: 'address'
    });
    generalInfo.belongsTo(models.cities, {
      foreignKey: 'notaryCity',
      as: 'city'
    });
    generalInfo.belongsTo(models.organization, {
      foreignKey: 'idCommerce',
      as: 'organization'
    });
    generalInfo.belongsTo(models.commerces, {
      foreignKey: 'idCommerce',
      as: 'commerce'
    });
  };
  return generalInfo;
};
