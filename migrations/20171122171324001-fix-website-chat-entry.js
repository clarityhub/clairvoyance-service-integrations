const settings = require('../settings.json');

const { clarityHubUrl } = settings;

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      UPDATE "Integrations" 
      SET
        "redirectUri"='https://integrations${clarityHubUrl}/website-chat/oauth',
        "callbackUrl"='https://integrations${clarityHubUrl}/website-chat/callback'
      WHERE
        "uuid"='dc7cd7ec-335d-4375-8b78-96984ca90d9e'
      `);
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      UPDATE "Integrations" 
      SET
        "redirectUri"='https://integrations.clarityhub.app/website-chat/oauth'
      WHERE
        "uuid"='dc7cd7ec-335d-4375-8b78-96984ca90d9e'
      `);
  },
};
