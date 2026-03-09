module.exports = (sequelize, DataTypes) => {
  const organization = sequelize.define('organization', {
    idCommerce: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'commerces',
        key: 'id'
      }
    },
    idUser: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      primaryKey: true,
      allowNull: false
    },
    idRoleMpos: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    idRoleEcommerce: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    idRoleTransfer: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    idRoleCards: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'id'
      }
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
    tableName: 'organization',
    freezeTableName: true,
    timestamps: false
  });

  organization.associate = (models) => {
    organization.belongsTo(models.commerces, {
      foreignKey: 'idCommerce',
      as: 'commerce'
    });
    organization.belongsTo(models.roles, {
      foreignKey: 'idRoleMpos',
      as: 'roleMpos'
    });
    organization.belongsTo(models.roles, {
      foreignKey: 'idRoleEcommerce',
      as: 'roleEcommerce'
    });
    organization.belongsTo(models.roles, {
      foreignKey: 'idRoleTransfer',
      as: 'roleTransfer'
    });
    organization.belongsTo(models.roles, {
      foreignKey: 'idRoleCards',
      as: 'roleCards'
    });
  };

  return organization;
};
