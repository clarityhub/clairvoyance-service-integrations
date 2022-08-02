const { getPublicEvents } = require('service-claire/events');
const {
  ok,
} = require('service-claire/helpers/responses');

const getEvents = async (req, res) => {
  ok(res)({
    events: getPublicEvents(),
  });
};

module.exports = {
  getEvents,
};
