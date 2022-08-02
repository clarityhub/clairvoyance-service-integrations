module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'Integrations',
        'callbackUrl',
        { type: Sequelize.STRING },
        { transaction }
      );

      await queryInterface.addColumn(
        'Integrations',
        'verificationToken',
        {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          validate: {
            notEmpty: true,
          },
        },
        { transaction }
      );

      return queryInterface.addColumn(
        'Integrations',
        'events',
        { type: Sequelize.ARRAY(Sequelize.STRING) },
        { transaction }
      );
    });
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn(
        'Integrations',
        'callbackUrl',
        { transaction }
      );

      await queryInterface.removeColumn(
        'Integrations',
        'verificationToken',
        { transaction }
      );

      return queryInterface.removeColumn(
        'Integrations',
        'events',
        { transaction }
      );
    });
  },
};
