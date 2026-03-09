module.exports = (sequelize, DataTypes) => {
  const lineBusiness = sequelize.define('lineBusiness', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    lineBussinessBanorte: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    CNBV: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(250),
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
    tableName: 'lineBusiness',
    freezeTableName: true,
    timestamps: false
  });

  lineBusiness.associate = function associate(models) {
    lineBusiness.hasMany(models.commerces, {
      foreignKey: 'idLineBusiness',
      as: 'commerces'
    });
  };
  return lineBusiness;
};
