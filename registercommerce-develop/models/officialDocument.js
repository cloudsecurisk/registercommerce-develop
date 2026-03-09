module.exports = (sequelize, DataTypes) => {
  const officialDocument = sequelize.define('officialDocument', {
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
      allowNull: true
    },
    institutionName: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    aspCode: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    sgsCode: {
      type: DataTypes.INTEGER(10).UNSIGNED,
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
    tableName: 'officialDocument',
    freezeTableName: true,
    timestamps: false
  });

  officialDocument.associate = function associate(models) {
    officialDocument.hasMany(models.legalRepresentative, {
      foreignKey: 'idOfificialDocument',
      as: 'legalRepresentative'
    });
  };

  return officialDocument;
};
