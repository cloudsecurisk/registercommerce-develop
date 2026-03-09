module.exports = (sequelize, DataTypes) => {
  const cities = sequelize.define('cities', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idState: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'states',
        key: 'id'
      }
    },
    clave: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'cities',
    freezeTableName: true,
    timestamps: false
  });

  cities.associate = function associate(models) {
    cities.hasMany(models.addresses, {
      foreignKey: 'idCity',
      as: 'addresses'
    });

    cities.hasMany(models.generalInfo, {
      foreignKey: 'notaryCity',
      as: 'notaryCity'
    });

    cities.belongsTo(models.states, {
      foreignKey: 'idState',
      as: 'states'
    });
  };

  return cities;
};
