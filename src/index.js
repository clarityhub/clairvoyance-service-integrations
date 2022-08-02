const express = require('express');
const bodyParser = require('body-parser');
const { settings } = require('service-claire/helpers/config');
const helmet = require('service-claire/middleware/helmet');
const errorHandler = require('service-claire/middleware/errors');
const logger = require('service-claire/helpers/logger');

const limits = require('./rate-limits');
const routes = require('./routes');
require('./v1_0/subscriptions');

logger.register('aaa76a6c679901530644a092636bc6cc');

const app = express();

app.enable('trust proxy');
app.use(helmet());
app.use(bodyParser.json());
app.use(limits);
app.use('/integrations', routes);
app.use(errorHandler);

const server = app.listen(
  settings.port,
  () => logger.log(`✅ 🔀 service-integrations running on port ${settings.port}`)
);

module.exports = { app, server }; // For testing
