module.exports = (sequelize, DataTypes) => {
  const states = sequelize.define('states', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    clave: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: '0'
    },
    abrev: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: '0'
    },
    iso: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    aspCode: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    sgsCode: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
  }, {
    tableName: 'states',
    freezeTableName: true,
    timestamps: false
  });

  states.associate = function associate(models) {
    states.hasMany(models.addresses, {
      foreignKey: 'idState',
      as: 'addresses'
    });
  };

  return states;
};
