module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Integrations',
      'redirectUri',
      {
        type: Sequelize.STRING,
      }
    );
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('Integrations', 'redirectUri');
  },
};
