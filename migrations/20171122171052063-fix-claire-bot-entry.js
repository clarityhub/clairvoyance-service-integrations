const settings = require('../settings.json');

const { clarityHubUrl } = settings;

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      UPDATE "Integrations" 
      SET
        "name"='Claire Bot',
        "shortDescription"='Claire Bot automatically suggests answers to questions you''ve answered before',
        "redirectUri"='https://integrations${clarityHubUrl}/suggestions/oauth',
        "callbackUrl"='https://integrations${clarityHubUrl}/suggestions/callback'
      WHERE
        "uuid"='65f3c689-5c8f-4ac3-8e82-ea56871e327b'
      `);
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      UPDATE "Integrations" 
      SET
        "redirectUri"='https://integrations.clarityhub.app/suggestions/oauth'
      WHERE
        "uuid"='65f3c689-5c8f-4ac3-8e82-ea56871e327b'
      `);
  },
};
