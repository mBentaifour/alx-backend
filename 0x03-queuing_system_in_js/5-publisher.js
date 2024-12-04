import redis from 'redis';

// Créer un client Redis
const publisher = redis.createClient();

// Gestion de l'événement "connect"
publisher.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Gestion de l'événement "error"
publisher.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

// Fonction pour publier un message après un certain délai
function publishMessage(message, time) {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    publisher.publish('holberton school channel', message);
  }, time);
}

// Appel de la fonction avec différents messages et délais
publishMessage("Holberton Student #1 starts course", 100);
publishMessage("Holberton Student #2 starts course", 200);
publishMessage("KILL_SERVER", 300);
publishMessage("Holberton Student #3 starts course", 400);

