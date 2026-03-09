/* eslint-disable no-console */
const config = require('config');
const fetch = require('node-fetch');
const response = require('../../utils/response');
const { contract: Contract } = require('../../../models');
const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('weetrust-controller');

async function getWeetrustWebhooks(_req, res) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };

  try {
    const url = config.get('weetrust.base');
    const userId = config.get('weetrust.userId');
    const apiKey = config.get('weetrust.apiKey');

    const accessTokenResponse = await fetch(`${url}/access/token`, {
      method: 'POST',
      headers: {
        'user-id': userId,
        'api-key': apiKey,
      },
    });

    const { responseData: { accessToken } } = await accessTokenResponse.json();
    console.log('Access Token:', accessToken, 'User ID:', userId, 'API Key:', apiKey);

    const webhooksResponse = await fetch(`${url}/webhooks`, {
      method: 'GET',
      headers: {
        'user-id': userId,
        'api-key': apiKey,
        token: accessToken,
      },
    });

    const data = await webhooksResponse.json();

    if (!accessToken) {
      Glogger.error({
        message: 'Error creating commerce.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, _req);
      return res.json(response.errorMessage(500, 'Internal Server Error', 'No access token'));
    }

    return res.json(response.successData({ message: 'Webhooks fetched', data }));
  } catch (error) {
    Glogger.error({
      message: 'Error creating commerce.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, _req, error);
    return res.json(response.errorMessage(500, 'Internal Server Error', error));
  }
}

async function createWeetrustWebhooks(req, res) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };

  try {
    const url = config.get('weetrust.base');
    const urlWebhook = config.get('weetrust.webhookUrl');
    const userId = config.get('weetrust.userId');
    const apiKey = config.get('weetrust.apiKey');

    const accessTokenResponse = await fetch(`${url}/access/token`, {
      method: 'POST',
      headers: {
        'user-id': userId,
        'api-key': apiKey,
      },
    });

    const { responseData: { accessToken } } = await accessTokenResponse.json();

    console.log('Access Token:', accessToken);

    if (!accessToken) {
      Glogger.error({
        message: 'Error creating token, weeTrust.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, req);
      return res.json(response.errorMessage(500, 'Internal Server Error', 'No access token'));
    }

    const types = ['sendDocument', 'completedDocument', 'signDocument', 'pendingBiometric', 'failedBiometric', 'failedBiometricRequest'];

    const webhookPromises = types.map(async (type) => {
      const webhooksResponse = await fetch(`${url}/webhooks?url=${urlWebhook}&type=${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId,
          'api-key': apiKey,
          token: accessToken,
        },
        body: JSON.stringify({
          options: [
            {
              key: 'X-API-Key',
              value: '15b5e0.855d7c92-b494-4b93-9fab-b93076e1ff0f',
            },
          ],
        }),
      });

      const data = await webhooksResponse.json();
      const text = await webhooksResponse.text();
      console.log('Raw response:', text);
      console.log(JSON.stringify(data, null, 2));
      return data;
    });

    const data = await Promise.all(webhookPromises);

    if (data.some(item => item.error)) {
      Glogger.error({
        message: 'Error creating webhooks.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, req);
      return res.json(response.errorMessage(500, 'Internal Server Error', 'Error creating webhooks'));
    }

    Glogger.info({
      message: 'Webhooks created successfully.',
      user: {
        id,
        email,
        idSession
      },
      status: 200
    }, req);
    console.log('Webhooks created successfully:', data);
    // If you want to return the first successful webhook creation
    return res.json(response.successData({ message: 'Webhook created', data }));
  } catch (error) {
    console.error('Error creating webhooks:', error);
    Glogger.error({
      message: 'Error creating webhooks.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, error);
    return res.json(response.errorMessage(500, 'Internal Server Error', error));
  }
}

async function updateWebhookUrl(req, res) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };

  try {
    const url = config.get('weetrust.base');
    const userId = config.get('weetrust.userId');
    const apiKey = config.get('weetrust.apiKey');
    // const webhookId = config.get('weetrust.webhookId');
    const urlWebhook = config.get('weetrust.webhookUrl');

    const accessTokenResponse = await fetch(`${url}/access/token`, {
      method: 'POST',
      headers: {
        'user-id': userId,
        'api-key': apiKey,
      },
    });

    const { responseData: { accessToken } } = await accessTokenResponse.json();

    if (!accessToken) {
      Glogger.error({
        message: 'Error creating token, weeTrust.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, req);
      return response.errorMessage(500, 'Internal Server Error', 'No access token');
    }

    const webhookIds = ['663cc65bc0c05b40acc96ca0f01b0df830c94018', 'fbbad42f431ea0ccbd75520d6e32d10f06a45650', '450d22849e2932f671eb1a37d32650e549ff6a6a', 'bd08378aabfd97997d76e5a9b763c718fafdd8c8', 'bd08378aabfd97997d76e5a9b763c718fafdd8c8', '0c8521a46d1102828650ec55380321d1c1a89a15'];
    const types = ['sendDocument', 'completedDocument', 'signDocument', 'pendingBiometric', 'failedBiometric', 'failedBiometricRequest'];
    const webhookPromises = types.map(async (type, index) => {
      const webhooksResponse = await fetch(`${url}/webhooks?webHookID=${webhookIds[index]}&url=${urlWebhook}&type=${type}`, {
        method: 'PUT',
        headers: {
          'user-id': userId,
          'api-key': apiKey,
          token: accessToken,
        },
      });

      const data = await webhooksResponse.json();
      console.log(JSON.stringify(data, null, 2));
      return data;
    });
    const data = await Promise.all(webhookPromises);
    if (data.some(item => item.error)) {
      Glogger.error({
        message: 'Error updating webhooks.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, req);
      return res.json(response.errorMessage(500, 'Internal Server Error', 'Error updating webhooks'));
    }
    console.log('Webhooks updated successfully:', data);
    Glogger.info({
      message: 'Webhooks updated successfully.',
      user: {
        id,
        email,
        idSession
      },
      status: 200
    }, req);
    return res.json(response.successData({ message: 'Webhook updated', data }));
  } catch (error) {
    Glogger.error({
      message: 'Error updating webhooks.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, error);
    return response.errorMessage(500, 'Internal Server Error', error);
  }
}

async function deleteWeetrustWebhookById(req, res) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };


  try {
    const url = config.get('weetrust.base');
    const userId = config.get('weetrust.userId');
    const apiKey = config.get('weetrust.apiKey');
    const webhookId = req.params.id;

    if (!webhookId) {
      return res.json(response.errorMessage(400, 'Bad Request', 'Webhook ID is required'));
    }

    const accessTokenResponse = await fetch(`${url}/access/token`, {
      method: 'POST',
      headers: {
        'user-id': userId,
        'api-key': apiKey,
      },
    });

    const { responseData: { accessToken } } = await accessTokenResponse.json();

    if (!accessToken) {
      return res.json(response.errorMessage(500, 'Internal Server Error', 'No access token'));
    }

    const webhooksResponse = await fetch(`${url}/webhooks?webHookID=${webhookId}`, {
      method: 'DELETE',
      headers: {
        'user-id': userId,
        'api-key': apiKey,
        token: accessToken,
      },
    });

    const data = await webhooksResponse.json();

    if (data.error) {
      Glogger.error({
        message: 'Error deleting webhooks.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, req);
      return res.json(response.errorMessage(500, 'Internal Server Error', data.error));
    }
    Glogger.info({
      message: 'Webhooks deleted successfully.',
      user: {
        id,
        email,
        idSession
      },
      status: 200
    }, req);
    return res.json(response.successData({ message: 'Webhooks deleted', data }));
  } catch (error) {
    Glogger.error({
      message: 'Error deleting webhooks.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, error);
    return res.json(response.errorMessage(500, 'Internal Server Error', error));
  }
}

async function completedDocument(req, res) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };

  try {
    const data = req.body;
    const { _id } = data.Document;

    let status = 1;
    if (req.body.type === 'completedDocument' || req.body.type === 'signDocument') {
      status = 2;
    }
    if (req.body.type === 'pendingBiometric') {
      status = 3;
    }
    if (req.body.type === 'failedBiometricRequest') {
      status = 5;
    }
    if (req.body.type === 'sendDocument') {
      status = 6;
    }

    const contract = Contract.findOne({
      attributes: ['status'],
      where: {
        contract: _id
      }
    });

    if (contract.status !== 2) {
      Contract.update({
        status
      }, {
        where: {
          contract: _id
        }
      });
    }
    if (req.body && req.body.Document) {
      delete req.body.Document;
    }
    Glogger.info({
      message: 'Commerce completed document successfully.',
      user: {
        id,
        email,
        idSession
      },
      status: 200
    }, req);
    return res.json(response.successData({ message: 'Document completed', data }));
  } catch (error) {
    console.log(error);
    Glogger.error({
      message: 'Error commerce completed document.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, error);
    return res.json(response.errorMessage(500, 'Internal Server Error', error));
  }
}

module.exports = {
  getWeetrustWebhooks,
  createWeetrustWebhooks,
  updateWebhookUrl,
  completedDocument,
  deleteWeetrustWebhookById
};
