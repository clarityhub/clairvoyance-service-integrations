const urlPrefix = process.env.URL_PREFIX;
let url = '';
let callbackUrl;

if (urlPrefix) {
  url = `https://integrations.${urlPrefix}clarityhub.io/website-chat`;
  callbackUrl = `${url}/callback`;
} else {
  url = 'https://integrations.clarityhub.app/website-chat';
  callbackUrl = 'http://integration-website-chat:3000/website-chat/callback';
}

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'Integrations',
      [{
        uuid: 'dc7cd7ec-335d-4375-8b78-96984ca90d9e',
        accountId: 1,
        userId: 1,
        name: 'In-website Chat',
        shortDescription: 'Let your customers chat with you directly from your existing website',
        redirectUri: `${url}/oauth`,
        status: 'public',
        callbackUrl,
        verificationToken: '9c0e7b25-92bd-479d-b895-436214a535ca',
      }]
    );
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      DELETE FROM "Integrations" WHERE
        "uuid"='dc7cd7ec-335d-4375-8b78-96984ca90d9e'
      `);
  },
};
