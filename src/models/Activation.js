module.exports = function (sequelize, Sequelize) {
  const Activation = sequelize.define('Activation', {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    accountId: {
      type: Sequelize.BIGINT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    settings: {
      // JSONB since it is faster to process
      type: Sequelize.JSONB,
    },
  }, {
    timestamps: false,
  });

  Activation.associate = function (models) {
    models.Integration.Activations = models.Integration.hasMany(Activation);
    Activation.Integration = Activation.belongsTo(models.Integration);
  };

  return Activation;
};
