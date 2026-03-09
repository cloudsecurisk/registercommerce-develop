module.exports = (sequelize, DataTypes) => {
  const amexRecords = sequelize.define('amexRecords', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    amexRecord: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    submmisionFileRecord: {
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
    tableName: 'amexRecords',
    freezeTableName: true,
    timestamps: false
  });

  return amexRecords;
};
