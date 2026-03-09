module.exports = (sequelize, DataTypes) => {
  const societyPosition = sequelize.define('societyPosition', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(45),
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
    tableName: 'societyPosition',
    freezeTableName: true,
    timestamps: false
  });

  societyPosition.associate = (models) => {
    societyPosition.hasMany(models.legalRepresentative, {
      foreignKey: 'idSocietyPosition',
      as: 'legalRepresentative'
    });
  };

  return societyPosition;
};
