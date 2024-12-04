import redis from 'redis';

// Créer un client Redis
const subscriber = redis.createClient();

// Gestion de l'événement "connect"
subscriber.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Gestion de l'événement "error"
subscriber.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

// S'abonner au canal "holberton school channel"
subscriber.subscribe('holberton school channel');

// Quand un message est reçu, il est loggé
subscriber.on('message', (channel, message) => {
  console.log(message);
  // Si le message est "KILL_SERVER", désabonne-toi et quitte
  if (message === 'KILL_SERVER') {
    subscriber.unsubscribe();
    subscriber.quit();
  }
});

