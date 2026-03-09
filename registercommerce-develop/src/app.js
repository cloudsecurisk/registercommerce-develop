const bodyParser = require('body-parser');
const config = require('config');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const routes = require('./routes');
const response = require('./utils/response');
const invalidReoute = require('./routes/invalidRoute');

const env = process.env.NODE_ENV;
const app = express();

app.use(helmet());
app.use(cors(config.get('cors')));
app.use(bodyParser.json({ limit: '50mb' }));

if (env !== 'production') {
  app.use(morgan('dev'));
}

// mount /api routes
app.use('/api', routes);

// mount ping endpoint
app.get('/ping', (req, res) => res.status(200).send(Date.now().toString()));
app.use(invalidReoute);

/* eslint no-unused-vars: 0 */
// error handler
app.use((err, req, res, next) => {
  if (env !== 'production') {
    console.log('[ERROR]');
    console.log(err);
  }
  if (err.status) {
    return res.status(err.status).json(err);
  }
  return res.status(500).json(err);
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json(response.errorMessage(404, `The ${req.path} endpoint doesn't exists`));
});

module.exports = app;
