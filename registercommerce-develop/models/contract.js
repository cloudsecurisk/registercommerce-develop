/* eslint-disable no-console */
module.exports = (sequelize, DataTypes) => {
  const contract = sequelize.define('contract', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idCommerce: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'commerces',
        key: 'id'
      }
    },
    contract: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: false
    },
    type: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      defaultValue: false
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
    tableName: 'contract',
    freezeTableName: true,
    timestamps: false,
    // @note set engine for table
    engine: 'InnoDB',
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });

  // // @note create table in MySQL
  // contract.sync({
  //   alter: true
  // }).then(() => {
  //   console.log('[+] contract table created');
  // }).catch((error) => {
  //   console.log('[!] Error creating contract table', error);
  // });

  contract.associate = (models) => {
    contract.belongsTo(models.commerces, {
      foreignKey: 'idCommerce',
      as: 'commerce'
    });
  };


  return contract;
};
