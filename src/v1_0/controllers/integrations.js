const pick = require('lodash/pick');
const {
  ok, error, notFound, badRequest,
} = require('service-claire/helpers/responses');
const logger = require('service-claire/helpers/logger');
const {
  Integration,
  Activation,
} = require('../../models');
const {
  PUBLIC,
} = require('../../enums/statuses');

/**
 * @private
 */
const validate = ({ name, shortDescription }) => {
  if (name === null || typeof name === 'undefined' ||
    !(typeof name === 'string') || name.trim() === '') {
    return {
      valid: false,
      reason: 'Invalid name',
    };
  }

  if (shortDescription !== null &&
    typeof shortDescription !== 'undefined' &&
    !(typeof name === 'string')) {
    return {
      valid: false,
      reason: 'The short description must be a string',
    };
  }

  return { valid: true };
};

const getIntegrations = async (req, res) => {
  const { accountId, userId } = req.user;

  try {
    const integrations = await Integration.findAll({
      attributes: Integration.cleanAttributes,
      where: {
        accountId,
        userId,
      },
    });

    if (integrations && integrations instanceof Array) {
      ok(res)({
        count: integrations.length,
        integrations,
      });
    } else {
      ok(res)({
        count: 0,
        integrations: [],
      });
    }
  } catch (err) {
    logger.error(err);
    error(res)(err);
  }
};

const getActiveIntegrations = async (req, res) => {
  const { accountId } = req.user;

  try {
    const activations = await Activation.findAll({
      attributes: Activation.cleanAttributes,
      where: {
        accountId,
      },
      include: [
        {
          required: true,
          model: Integration,
        },
      ],
    });

    const integrations = activations.map((a) => {
      const payload = pick(
        a.Integration,
        Integration.cleanPublicAttributes
      );
      payload.active = true;
      return payload;
    });

    if (integrations && integrations instanceof Array) {
      ok(res)({
        count: integrations.length,
        integrations,
      });
    } else {
      ok(res)({
        count: 0,
        integrations: [],
      });
    }
  } catch (err) {
    logger.error(err);
    error(res)(err);
  }
};

const getIntegration = async (req, res) => {
  const { accountId, userId } = req.user;
  const { uuid } = req.params;

  try {
    const integration = await Integration.findOne({
      where: {
        uuid,
      },
    });

    const activation = await Activation.findOne({
      attributes: Activation.cleanAttributes,
      where: {
        accountId,
      },
      include: [
        {
          required: true,
          model: Integration,
          where: {
            uuid: integration.uuid,
          },
        },
      ],
    });

    if (integration) {
      if (userId !== integration.userId || accountId !== integration.accountId) {
        // this is a public look up. Only okay of the integration status is public
        if (integration.status === PUBLIC) {
          const payload = pick(integration, Integration.cleanPublicAttributes);
          payload.active = Boolean(activation);
          ok(res)(payload);
        } else {
          notFound(res)();
        }
        return;
      }
      const payload = pick(integration, Integration.cleanAttributes);
      payload.active = Boolean(activation);
      ok(res)(payload);
    } else {
      notFound(res)();
    }
  } catch (err) {
    logger.error(err);
    error(res)(err);
  }
};

const createIntegration = async (req, res) => {
  const { accountId, userId } = req.user;
  const {
    name,
    shortDescription,
  } = req.body;

  try {
    const { valid, reason } = validate({
      name,
      shortDescription,
    });

    if (!valid) {
      badRequest(res)({
        reason,
      });
      return;
    }

    const integration = await Integration.create({
      name,
      shortDescription,
      accountId,
      userId,
    }, {
      returning: true,
    });

    await req.services.rpc.call('createCredentials', {
      integrationUuid: integration.uuid,
      accountId,
      userId,
    });

    const cleanIntegration = pick(integration, Integration.cleanAttributes);

    ok(res)(cleanIntegration);
  } catch (err) {
    // TODO roll back Integration.create if createCredentials fails
    logger.error(err);
    error(res)(err);
  }
};

const updateIntegration = async (req, res) => {
  const { uuid } = req.params;
  const { accountId, userId } = req.user;
  const {
    name,
    shortDescription,
    redirectUri,
  } = req.body;

  try {
    // TODO validate uuid
    const { valid, reason } = validate({
      name,
      shortDescription,
    });

    if (!valid) {
      badRequest(res)({
        reason,
      });
      return;
    }

    const [count, integrations] = await Integration.update({
      name,
      shortDescription,
      redirectUri,
    }, {
      where: {
        accountId,
        userId,
        uuid,
      },
      returning: true,
    });

    if (count === 0) {
      notFound(res)({});
      return;
    }

    const integration = integrations[0];

    await req.services.rpc.call('updateCredentials', {
      integrationUuid: integration.uuid,
      accountId,
      userId,
      redirectUri,
    });

    const cleanIntegration = pick(integration, Integration.cleanAttributes);

    ok(res)(cleanIntegration);
  } catch (err) {
    logger.error(err);
    error(res)(err);
  }
};

const deleteIntegration = async (req, res) => {
  const { uuid } = req.params;
  const { accountId, userId } = req.user;

  try {
    // TODO validate uuid

    await req.services.rpc.call('deleteCredentials', {
      integrationUuid: uuid,
    });

    const count = await Integration.destroy({
      where: {
        uuid,
        accountId,
        userId,
      },
    });

    if (count === 0) {
      notFound(res)();
      return;
    }

    ok(res)({});
  } catch (err) {
    logger.error(err);
    error(res)(err);
  }
};


module.exports = {
  getIntegrations,
  getActiveIntegrations,
  getIntegration,
  createIntegration,
  updateIntegration,
  deleteIntegration,
};
