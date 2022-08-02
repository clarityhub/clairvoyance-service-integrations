const { fanoutQueue } = require('service-claire/services/pubsub');
const {
  INTEGRATION_ACTIVATED,
  INTEGRATION_REVOKED,
} = require('service-claire/events');
const { sendEvent, sendAction, sendOauth } = require('./controllers/callbacks');
const { activateIntegration, revokeIntegration } = require('./controllers/activations');

const chatExchange = `${process.env.NODE_ENV || 'development'}.chats`;
const integrationExchange = `${process.env.NODE_ENV || 'development'}.integrations`;
const suggestionsExchange = `${process.env.NODE_ENV || 'development'}.suggestions`;
// TODO statuses
// TODO notifications
// TODO typing events

fanoutQueue(chatExchange, 'service-integrations-chats', sendEvent);

fanoutQueue(integrationExchange, 'service-integrations-int', async (message) => {
  switch (message.event) {
    case INTEGRATION_ACTIVATED:
      activateIntegration(message.meta);
      if (message.meta.send) {
        sendOauth(message);
      }
      break;
    case INTEGRATION_REVOKED:
      // Send oauth first since it needs the entries we are
      // about to delete
      await sendOauth(message);
      revokeIntegration(message.meta);
      break;
    default:
      // Do nothing
  }
});

fanoutQueue(suggestionsExchange, 'service-integrations-suggestions', sendAction);
