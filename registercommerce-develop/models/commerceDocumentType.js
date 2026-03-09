module.exports = (sequelize, DataTypes) => {
  const commerceDocumentType = sequelize.define('commerceDocumentType', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idSublai: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    clave: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(100),
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
    tableName: 'commerceDocumentType',
    freezeTableName: true,
    timestamps: false
  });

  commerceDocumentType.associate = function associate(models) {
    commerceDocumentType.hasMany(models.commerceDocumentV2, {
      foreignKey: 'idDocumentType',
      as: 'commerceDocumentV2'
    });
  };

  return commerceDocumentType;
};
