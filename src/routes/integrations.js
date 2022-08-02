const versionRouter = require('express-version-route');
const authMiddleware = require('service-claire/middleware/auth');
const rpcMiddleware = require('service-claire/middleware/rpc');
const makeMap = require('service-claire/helpers/makeMap');
const cors = require('cors');

const v1_0 = require('../v1_0/controllers/integrations');

module.exports = (router) => {
  router.route('/')
    .options(cors())
    .get(
      cors(),
      authMiddleware,
      versionRouter.route(makeMap({
        '1.0': v1_0.getIntegrations,
        default: v1_0.getIntegrations,
      }))
    )
    .post(
      cors(),
      authMiddleware,
      rpcMiddleware,
      versionRouter.route(makeMap({
        '1.0': v1_0.createIntegration,
        default: v1_0.createIntegration,
      }))
    );

  router.route('/active')
    .options(cors())
    .get(
      cors(),
      authMiddleware,
      versionRouter.route(makeMap({
        '1.0': v1_0.getActiveIntegrations,
        default: v1_0.getActiveIntegrations,
      }))
    );

  router.route('/:uuid')
    .options(cors())
    .get(
      cors(),
      authMiddleware,
      versionRouter.route(makeMap({
        '1.0': v1_0.getIntegration,
        default: v1_0.getIntegration,
      }))
    )
    .put(
      cors(),
      authMiddleware,
      rpcMiddleware,
      versionRouter.route(makeMap({
        '1.0': v1_0.updateIntegration,
        default: v1_0.updateIntegration,
      }))
    )
    .delete(
      cors(),
      authMiddleware,
      rpcMiddleware,
      versionRouter.route(makeMap({
        '1.0': v1_0.deleteIntegration,
        default: v1_0.deleteIntegration,
      }))
    );
};
