module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Activations',
      'settings',
      {
        type: Sequelize.JSONB,
      }
    );
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('Activations', 'settings');
  },
};
