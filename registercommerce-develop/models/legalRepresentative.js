module.exports = (sequelize, DataTypes) => {
  const legalRepresentative = sequelize.define(
    'legalRepresentative',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      idCommerce: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        references: {
          model: 'commerces',
          key: 'id',
        },
      },
      idMaritalStatus: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        references: {
          model: 'maritalStatus',
          key: 'id',
        },
      },
      idAddress: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        references: {
          model: 'addresses',
          key: 'id',
        },
      },
      idOfificialDocument: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        references: {
          model: 'officialDocument',
          key: 'id',
        },
      },
      idSocietyPosition: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        defaultValue: 2,
        references: {
          model: 'societyPosition',
          key: 'id',
        },
      },
      idOccupation: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
      },
      // @note: sgs
      idOccupationSGS: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        defaultValue: 0,
      },
      idPerson: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        defaultValue: 0,
      },
      gender: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      electronicSignatureSerialNumber: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      isValidated: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      motherLastName: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      birthday: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      RFC: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      CURP: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      oficialDocumentNumber: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      validity: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      // moral
      publicInstrumentNumber: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      publicInstrumentDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      publicInstrumentLocation: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        references: {
          model: 'cities',
          key: 'id',
        },
        unique: true,
      },
      publicInstrumentNotary: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      publicInstrumentNotaryNumber: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      publicInstrumentDateRegistration: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      idPublicInstrumentCity: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        references: {
          model: 'cities',
          key: 'id',
        },
        unique: true,
      },
      // end moral
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'legalRepresentative',
      freezeTableName: true,
      timestamps: false,
    }
  );

  legalRepresentative.associate = function associate(models) {
    legalRepresentative.belongsTo(models.commerces, {
      foreignKey: 'idCommerce',
      as: 'commerces',
    });

    legalRepresentative.belongsTo(models.maritalStatus, {
      foreignKey: 'idMaritalStatus',
      as: 'maritalStatus',
    });

    legalRepresentative.belongsTo(models.addresses, {
      foreignKey: 'idAddress',
      as: 'address',
    });

    legalRepresentative.belongsTo(models.officialDocument, {
      foreignKey: 'idOfificialDocument',
      as: 'officialDocument',
    });
    legalRepresentative.belongsTo(models.occupationASP, {
      foreignKey: 'idOccupation',
      as: 'occupation',
    });
    legalRepresentative.belongsTo(models.occupationSGS, {
      foreignKey: 'idOccupationSGS',
      as: 'occupationSGS',
    });
    legalRepresentative.belongsTo(models.societyPosition, {
      foreignKey: 'idSocietyPosition',
      as: 'societyPosition'
    });
    legalRepresentative.belongsTo(models.cities, {
      foreignKey: 'idPublicInstrumentCity',
      as: 'publicInstrumentCity',
    });
  };
  return legalRepresentative;
};
