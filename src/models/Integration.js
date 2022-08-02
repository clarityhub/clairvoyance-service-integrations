const statuses = require('../enums/statuses');

module.exports = function (sequelize, Sequelize) {
  const Integration = sequelize.define('Integration', {
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

    redirectUri: {
      type: Sequelize.STRING,
    },

    status: {
      type: Sequelize.ENUM(statuses.toArray()),
      defaultValue: statuses.PRIVATE,
      validate: {
        notEmpty: true,
      },
    },

    callbackUrl: Sequelize.STRING,
    verificationToken: {
      type: Sequelize.STRING,
      defaultValue: Sequelize.UUIDV4,
      validate: {
        notEmpty: true,
      },
    },
    events: Sequelize.ARRAY(Sequelize.STRING),

    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    deletedAt: Sequelize.DATE,
  }, {
    timestamps: true,
    paranoid: true,
  });

  Integration.cleanAttributes = [
    'uuid',
    'name',
    'shortDescription',
    'redirectUri',
    'status',
    'callbackUrl',
    'verificationToken',
    'events',
    'createdAt',
    'updatedAt',
  ];

  Integration.cleanPublicAttributes = [
    'uuid',
    'name',
    'shortDescription',
    'redirectUri',
    'status',
    'callbackUrl',
    'events',
    'createdAt',
    'updatedAt',
  ];

  return Integration;
};
