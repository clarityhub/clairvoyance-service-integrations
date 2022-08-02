module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Activations',
      {
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

        IntegrationId: {
          type: Sequelize.BIGINT,
        },
      }
    );
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('Activations');
  },
};
