const versionRouter = require('express-version-route');
const authMiddleware = require('service-claire/middleware/auth');
const makeMap = require('service-claire/helpers/makeMap');
const cors = require('cors');
const { unlimited } = require('../rate-limits');
const v1_0 = require('../v1_0/controllers/search');

module.exports = (router) => {
  router.route('/search')
    .options(cors)
    .post(
      cors(),
      authMiddleware,
      unlimited,
      versionRouter.route(makeMap({
        '1.0': v1_0.search,
        default: v1_0.search,
      }))
    );
};
