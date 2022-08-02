module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Integrations',
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },

        uuid: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          validate: {
            notEmpty: true,
          },
        },

        accountId: {
          type: Sequelize.BIGINT,
          validate: {
            notEmpty: true,
          },
        },

        userId: {
          type: Sequelize.BIGINT,
          validate: {
            notEmpty: true,
          },
        },

        name: {
          type: Sequelize.STRING,
          validate: {
            notEmpty: true,
          },
        },

        shortDescription: {
          type: Sequelize.TEXT,
        },

        status: {
          type: Sequelize.ENUM(['private', 'public']),
          defaultValue: 'private',
          validate: {
            notEmpty: true,
          },
        },

        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE,
      }
    );
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('Integrations');
  },
};
