module.exports = (sequelize, DataTypes) => {
  const executives = sequelize.define('executives', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idUser: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      unique: true
    },
    idPartner: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: '0'
    },
    phone: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    roleExecutive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    roleDistributor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    roleGroup: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    roleWholesaler: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    roleSubDistributor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Mpos_piso: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    Mpos_IntCred: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    Mpos_IntDev: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    Mpos_NacCred: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    Mpos_NacDev: {
      type: DataTypes.DECIMAL,
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
    tableName: 'executives',
    freezeTableName: true,
    timestamps: false
  });

  executives.associate = (models) => {
    executives.hasMany(models.executives, {
      foreignKey: 'idPartner',
      as: 'executive'
    });
    executives.belongsTo(models.executives, {
      foreignKey: 'idPartner',
      as: 'partner'
    });
    executives.hasMany(models.commerces, {
      foreignKey: 'idExecutive',
      as: 'executiveCommerce'
    });
    executives.hasMany(models.commerces, {
      foreignKey: 'idDistributor',
      as: 'distributor'
    });
    executives.hasMany(models.commerces, {
      foreignKey: 'idGroup',
      as: 'group'
    });
    executives.hasMany(models.commerces, {
      foreignKey: 'idWholesaler',
      as: 'wholesaler'
    });
    executives.hasMany(models.commerces, {
      foreignKey: 'idSubDistributor',
      as: 'subDistributor'
    });
  };

  return executives;
};
