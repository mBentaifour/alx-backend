import { createClient } from 'redis';

// Créer un client Redis
const client = createClient();

// Gestion de l'événement "connect"
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Gestion de l'événement "error"
client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

