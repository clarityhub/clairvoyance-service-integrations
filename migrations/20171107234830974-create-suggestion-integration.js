const urlPrefix = process.env.URL_PREFIX;
let url = '';
let callbackUrl;

if (urlPrefix) {
  url = `https://integrations.${urlPrefix}clarityhub.io/suggestions`;
  callbackUrl = `${url}/callback`;
} else {
  url = 'https://integrations.clarityhub.app/suggestions';
  callbackUrl = 'http://integration-claire-bot:3000/suggestions/callback';
}

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'Integrations',
      [{
        uuid: '65f3c689-5c8f-4ac3-8e82-ea56871e327b',
        accountId: 1,
        userId: 1,
        name: 'Claire Bot',
        shortDescription: 'Claire Bot automatically suggests answers to questions you\'ve answered before',
        redirectUri: `${url}/oauth`,
        status: 'public',
        callbackUrl,
        verificationToken: 'c87ef7c5-a4b7-4311-b547-ba66022ffe75',
        events: ['chat-message.created'],
      }]
    );
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      DELETE FROM "Integrations" WHERE
        "uuid"='65f3c689-5c8f-4ac3-8e82-ea56871e327b'
      `);
  },
};
