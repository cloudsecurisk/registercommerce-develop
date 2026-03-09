module.exports = (sequelize, DataTypes) => {
  const maritalStatus = sequelize.define('maritalStatus', {
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
    description: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: '0'
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
    tableName: 'maritalStatus',
    freezeTableName: true,
    timestamps: false
  });

  maritalStatus.associate = function associate(models) {
    maritalStatus.hasMany(models.legalRepresentative, {
      foreignKey: 'idMaritalStatus',
      as: 'legalRepresentative'
    });
  };
  return maritalStatus;
};
