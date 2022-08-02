const settings = require('../settings.json');

const { clarityHubUrl } = settings;
const { NODE_ENV } = process.env;
let url = '';
if (NODE_ENV === 'production') {
  url = `https://integrations${clarityHubUrl}/`;
} else {
  url = 'http://integration-claire-bot:3000';
}

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      UPDATE "Integrations" 
      SET
        "redirectUri"='${url}/suggestions/oauth',
        "callbackUrl"='${url}/suggestions/callback'
      WHERE
        "uuid"='65f3c689-5c8f-4ac3-8e82-ea56871e327b'
      `);
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      UPDATE "Integrations" 
      SET
        "redirectUri"='https://integrations${clarityHubUrl}/suggestions/oauth',
        "callbackUrl"='https://integrations${clarityHubUrl}/suggestions/callback'
      WHERE
        "uuid"='65f3c689-5c8f-4ac3-8e82-ea56871e327b'
      `);
  },
};
