const redis = require('redis');
const redisUri = require('config').get('redisUri');

const env = process.env.NODE_ENV;

let redisClient = null;

// Función asíncrona para asegurar la conexión.
// Esta es la ÚNICA que deberías llamar para obtener el cliente.
async function getClient() {
  // 1. Si no existe, créalo.
  if (!redisClient) {
    redisClient = redis.createClient(redisUri);
    // Configura manejo de errores para evitar que la aplicación se caiga.
    redisClient.on('error', (err) => {
      console.error('Redis Client Error', err);
      // Opcional: Anular el cliente para que se recree en el siguiente llamado
      // redisClient = null;
    });
  }

  // 2. Si no está conectado, conéctalo (espera la conexión).
  // La librería moderna maneja si ya está conectado.
  if (!redisClient.isReady) {
    await redisClient.connect();
  }
  return redisClient;
}

/* eslint consistent-return: 0 */
async function enqueueMail(listName, data) {
  if (env !== 'production') {
    return true; // Resuelve inmediatamente fuera de producción
  }

  try {
    const client = await getClient(); // Espera por el cliente conectado
    // rPush devuelve el nuevo tamaño de la lista, no usamos callbacks
    await client.rPush(listName, data);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = {
  enqueueMail
};
