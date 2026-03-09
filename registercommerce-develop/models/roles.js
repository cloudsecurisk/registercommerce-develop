module.exports = (sequelize, DataTypes) => {
  const roles = sequelize.define('roles', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
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
    tableName: 'roles',
    freezeTableName: true,
    timestamps: false
  });

  roles.associate = (models) => {
    roles.hasMany(models.organization, {
      foreignKey: 'idRoleMpos',
      as: 'organizationMpos'
    });
    roles.hasMany(models.organization, {
      foreignKey: 'idRoleEcommerce',
      as: 'organizationEcomerce'
    });
    roles.hasMany(models.organization, {
      foreignKey: 'idRoleTransfer',
      as: 'organizationTransfer'
    });
  };

  return roles;
};
