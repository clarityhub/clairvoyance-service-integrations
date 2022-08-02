const {
  ok, error, notFound, badRequest,
} = require('service-claire/helpers/responses');
const logger = require('service-claire/helpers/logger');
const {
  Activation,
  Integration,
} = require('../../models');

const validTypes = ['input', 'text', 'textarea'];
const validate = (settings) => {
  if (!(settings instanceof Array)) {
    return false;
  }

  const clean = [];

  for (let i = 0; i < settings.length; i++) {
    const s = settings[i];
    const cleanEntry = {};

    if (validTypes.indexOf(s.type) !== -1) {
      cleanEntry.type = s.type;
      cleanEntry.value = s.value;
      cleanEntry.label = s.label;
      cleanEntry.placeholder = s.placeholder;
      cleanEntry.disabled = s.disabled;
      cleanEntry.clipboard = s.clipboard;
    } else {
      return false;
    }

    clean.push(cleanEntry);
  }

  return clean;
};

const getSettings = async (req, res) => {
  const { uuid } = req.params;
  const { accountId } = req.user;

  try {
    const activation = await Activation.findOne({
      where: {
        accountId,
      },
      include: [
        {
          required: true,
          model: Integration,
          where: {
            uuid,
          },
        },
      ],
    });

    if (!activation) {
      notFound(res)();
      return;
    }

    ok(res)({
      settings: activation.settings,
    });
  } catch (err) {
    logger.error(err);
    error(res)(err);
  }
};

const updateSettings = async (req, res) => {
  const { uuid } = req.params;
  const { settings } = req.body;
  const { accountId } = req.user;
  const { uuid: integrationUuid } = req.integration;

  try {
    const valid = validate(settings);

    if (integrationUuid) {
      if (integrationUuid !== uuid) {
        badRequest(res)({
          reason: 'An integration cannot change the settings of another integration',
        });
        return;
      }
    }

    if (valid === false) {
      badRequest(res)({
        reason: 'The settings provided are not valid',
      });
      return;
    }

    const activation = await Activation.findOne({
      where: {
        accountId,
      },
      include: [
        {
          required: true,
          model: Integration,
          where: {
            uuid,
          },
        },
      ],
    });

    await Activation.update({
      settings: valid,
    }, {
      where: {
        id: activation.id,
      },
    });

    ok(res)({});

    if (!integrationUuid) {
      // XXX let the integration know that the settings were updated
      // by the user
    }
  } catch (err) {
    logger.error(err);
    error(res)(err);
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
