const omit = require('lodash/omit');
const uuidv4 = require('uuid/v4');
const rp = require('request-promise');
const validUrl = require('valid-url');
const {
  ok, error, notFound, badRequest,
} = require('service-claire/helpers/responses');
const logger = require('service-claire/helpers/logger');
const allEvents = require('service-claire/events');
const {
  Integration,
  Activation,
} = require('../../models');

// 15 seconds
const TIMEOUT = 1000 * 60 * 15;
const EVENTS = omit(allEvents, allEvents.blacklist);

const updateCallback = async (req, res) => {
  const { uuid } = req.params;
  const { accountId } = req.user;

  const {
    callbackUrl,
    events,
  } = req.body;

  if (callbackUrl === null || callbackUrl === '') {
    await Integration.update({
      callbackUrl,
      events,
    }, {
      where: {
        uuid,
        accountId,
      },
    });

    ok(res)({
      callbackUrl,
      events,
    });
    return;
  }

  // Check that callbackUrl is valid
  if (!validUrl.isUri(callbackUrl)) {
    badRequest(res)({
      reason: 'The callback url isn\'t valid',
    });
    return;
  }

  // Check that events is an array of string
  if (!(events instanceof Array && events.every(e => typeof e === 'string'))) {
    badRequest(res)({
      reason: 'The events that you are subscribing to must be an array of strings',
    });
    return;
  }

  // Check that the list of events are a-okay
  if (!events.every(e => Object.values(EVENTS).indexOf(e) !== -1)) {
    badRequest(res)({
      reason: 'One or more of your events are not valid',
    });
    return;
  }

  // XXX events need scopes

  try {
    const integration = await Integration.findOne({
      where: {
        uuid,
        accountId,
      },
    });

    if (!integration) {
      notFound(res)();
      return;
    }

    const challenge = uuidv4();

    // hit the url
    const options = {
      method: 'POST',
      uri: callbackUrl,
      json: true,
      body: {
        token: integration.verificationToken,
        type: 'url_verification',
        challenge,
      },
      timeout: TIMEOUT,
    };

    try {
      const response = await rp(options);

      if (response.challenge !== challenge) {
        badRequest(res)({
          reason: 'Incorrect challenge given',
        });
        return;
      }
    } catch (err) {
      console.log(err);
      badRequest(res)({
        reason: 'Invalid callback url',
      });
      return;
    }

    // Yay, it worked!
    await Integration.update({
      callbackUrl,
      events,
    }, {
      where: {
        id: integration.id,
      },
    });

    ok(res)({
      callbackUrl,
      events,
    });
  } catch (err) {
    logger.error(err);
    error(res)(err);
  }
};

const sendEvent = async (message) => {
  const { event, meta } = message;

  try {
    const { accountId } = meta.raw;

    const activations = await Activation.findAll({
      where: {
        accountId,
      },
      include: [
        {
          required: true,
          model: Integration,
          where: {
            callbackUrl: {
              $ne: null,
            },
            events: {
              $contains: [event],
            },
          },
        },
      ],
    });

    activations.forEach(async (activation) => {
      const integration = activation.Integration;

      const options = {
        method: 'POST',
        uri: integration.callbackUrl,
        json: true,
        timeout: TIMEOUT,
        body: {
          type: 'event_callback',
          token: integration.verificationToken,
          eventType: event,
          accountId: meta.raw.accountId,
          event: meta.clean,
        },
      };

      try {
        await rp(options);
      } catch (e) {
        logger.error(e);
      }
    });
  } catch (err) {
    logger.error(err);
  }
};


const sendAction = async (message) => {
  const { event, meta } = message;

  if (event !== allEvents.SUGGESTION_CHOSEN) {
    return;
  }

  try {
    const { accountId, integrationUuid } = meta.raw;

    const activations = await Activation.findAll({
      where: {
        accountId,
      },
      include: [
        {
          required: true,
          model: Integration,
          where: {
            uuid: integrationUuid,
            callbackUrl: {
              $ne: null,
            },
          },
        },
      ],
    });

    activations.forEach(async (activation) => {
      const integration = activation.Integration;

      const options = {
        method: 'POST',
        uri: integration.callbackUrl,
        json: true,
        timeout: TIMEOUT,
        body: {
          type: 'action_callback',
          token: integration.verificationToken,
          eventType: event,
          accountId,
          event: meta.clean,
        },
      };

      await rp(options);
    });
  } catch (err) {
    logger.error(err);
  }
};

const sendOauth = async (message) => {
  const { event, meta } = message;

  try {
    const { accountId, integrationUuid } = meta;
    const { accessToken, publicKey } = meta.raw;

    const integration = await Integration.findOne({
      where: {
        uuid: integrationUuid,
      },
    });

    const options = {
      method: 'POST',
      uri: integration.callbackUrl,
      json: true,
      timeout: TIMEOUT,
      body: {
        type: 'oauth_callback',
        token: integration.verificationToken,
        eventType: event,
        accountId,
        event: {
          accessToken,
          publicKey,
          accountId,
        },
      },
    };

    await rp(options);
  } catch (err) {
    logger.error(err);
  }
};

module.exports = {
  updateCallback,
  sendEvent,
  sendAction,
  sendOauth,
};
