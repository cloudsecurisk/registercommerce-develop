module.exports = (sequelize, DataTypes) => {
  const addresses = sequelize.define('addresses', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idCountry: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      references: {
        model: 'countries',
        key: 'id'
      }
    },
    idState: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      references: {
        model: 'states',
        key: 'id'
      }
    },
    idCity: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      references: {
        model: 'cities',
        key: 'id'
      }
    },
    street: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    suburb: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    zipCode: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    exteriorNumber: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    interiorNumber: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    city: {
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
    tableName: 'addresses',
    freezeTableName: true,
    timestamps: false
  });

  addresses.associate = function associate(models) {
    addresses.belongsTo(models.countries, {
      foreignKey: 'idCountry',
      as: 'countries'
    });
    addresses.belongsTo(models.states, {
      foreignKey: 'idState',
      as: 'states'
    });
    addresses.belongsTo(models.cities, {
      foreignKey: 'idCity',
      as: 'cities'
    });
    addresses.hasMany(models.commerces, {
      foreignKey: 'idAddress',
      as: 'generalInfo'
    });
    addresses.hasMany(models.legalRepresentative, {
      foreignKey: 'idAddress',
      as: 'legalRepresentative'
    });
  };

  return addresses;
};
