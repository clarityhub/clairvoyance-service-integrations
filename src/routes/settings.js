const versionRouter = require('express-version-route');
const authMiddleware = require('service-claire/middleware/auth');
const { integrationMiddleware } = require('service-claire/middleware/auth');
const makeMap = require('service-claire/helpers/makeMap');
const cors = require('cors');

const v1_0 = require('../v1_0/controllers/settings');

module.exports = (router) => {
  router.route('/:uuid/settings')
    .options(cors())
    .get(
      cors(),
      integrationMiddleware(),
      authMiddleware,
      versionRouter.route(makeMap({
        '1.0': v1_0.getSettings,
        default: v1_0.getSettings,
      }))
    )
    .put(
      cors(),
      integrationMiddleware(),
      authMiddleware,
      versionRouter.route(makeMap({
        '1.0': v1_0.updateSettings,
        default: v1_0.updateSettings,
      }))
    );
};
