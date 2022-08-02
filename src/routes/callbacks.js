const versionRouter = require('express-version-route');
const authMiddleware = require('service-claire/middleware/auth');
const makeMap = require('service-claire/helpers/makeMap');
const cors = require('cors');

const v1_0 = require('../v1_0/controllers/callbacks');

module.exports = (router) => {
  router.route('/:uuid/callbacks')
    .options(cors())
    .put(
      cors(),
      authMiddleware,
      versionRouter.route(makeMap({
        '1.0': v1_0.updateCallback,
        default: v1_0.updateCallback,
      }))
    );
};
