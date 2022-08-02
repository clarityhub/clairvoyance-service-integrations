const versionRouter = require('express-version-route');
const makeMap = require('service-claire/helpers/makeMap');
const cors = require('cors');

const v1_0 = require('../v1_0/controllers/events');

module.exports = (router) => {
  router.route('/events')
    .options(cors())
    .get(
      cors(),
      versionRouter.route(makeMap({
        '1.0': v1_0.getEvents,
        default: v1_0.getEvents,
      }))
    );
};
