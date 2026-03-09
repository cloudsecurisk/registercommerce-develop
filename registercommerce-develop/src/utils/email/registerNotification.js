const { enqueueMail } = require('../redis');

function sendRegistrationNotification(commerceName, idCommerce) {
  if (commerceName && idCommerce) {
    enqueueMail('emailsList', JSON.stringify({
      to: [
        {
          email: 'maxfernandez@espiralapp.com',
          vars: {
            COMMERCE: commerceName,
            idCommerce
          }
        }
      ],
      subject: `Notificación de registro - ${commerceName} - ${idCommerce}`,
      template: 'registercommerce/registrationNotification',
      origin: 'registercommerce'
    }));
    return true;
  }
  return false;
}

module.exports = sendRegistrationNotification;
