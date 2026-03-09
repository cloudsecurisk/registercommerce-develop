module.exports = (sequelize, DataTypes) => {
  const countries = sequelize.define('countries', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    citizenship: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    aspCode: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    aspCodeNationality: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    sgsCodeNationality: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
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
    tableName: 'countries',
    freezeTableName: true,
    timestamps: false
  });

  countries.associate = function associate(models) {
    countries.hasMany(models.addresses, {
      foreignKey: 'idCountry',
      as: 'addresses'
    });
  };
  return countries;
};
