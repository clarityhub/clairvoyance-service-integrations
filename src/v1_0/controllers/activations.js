const logger = require('service-claire/helpers/logger');
const {
  Activation,
  Integration,
} = require('../../models');

const activateIntegration = async (meta) => {
  try {
    const { integrationUuid, accountId } = meta;

    const integration = await Integration.findOne({
      where: {
        uuid: integrationUuid,
      },
    });

    const activation = await Activation.findOne({
      where: {
        accountId,
        IntegrationId: integration.id,
      },
    });

    // Don't create duplicate entries for the integration-activation pair
    if (!activation) {
      await Activation.create({
        accountId,
        IntegrationId: integration.id,
      });
    }
  } catch (err) {
    logger.error(err);
  }
};

const revokeIntegration = async (meta) => {
  try {
    const { integrationUuid, accountId } = meta;

    const integration = await Integration.findOne({
      where: {
        uuid: integrationUuid,
      },
    });

    await Activation.destroy({
      where: {
        accountId,
        IntegrationId: integration.id,
      },
    });
  } catch (err) {
    logger.error(err);
  }
};

module.exports = {
  activateIntegration,
  revokeIntegration,
};
