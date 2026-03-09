module.exports = (sequelize, DataTypes) => {
  const occupationSGS = sequelize.define('occupationSGS', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: false,
    }
  }, {
    tableName: 'occupationSGS',
    freezeTableName: true,
    timestamps: false
  });
  // @note: create table occupationSGS

  // occupationSGS.sync({ alter: true })
  //   .then(() => {
  //     // eslint-disable-next-line no-console
  //     console.log('[+] Table occupationSGS created');
  //   }).catch((err) => {
  //     // eslint-disable-next-line no-console
  //     console.log('[-] Table occupationSGS was not created', err);
  //   });

  occupationSGS.associate = function associate(models) {
    occupationSGS.hasMany(models.legalRepresentative, {
      foreignKey: 'idOccupationSGS',
      as: 'legalRepresentative'
    });
  };

  return occupationSGS;
};
