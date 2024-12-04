import { createClient, print } from 'redis'; // Importation de 'print' de redis

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

// Créer un Hash avec hset
function createHash() {
  const hashKey = 'HolbertonSchools';
  client.hset(hashKey, 'Portland', 50, print);   // Utilisation de 'print' importé de redis
  client.hset(hashKey, 'Seattle', 80, print);    // Utilisation de 'print' importé de redis
  client.hset(hashKey, 'New York', 20, print);   // Utilisation de 'print' importé de redis
  client.hset(hashKey, 'Bogota', 20, print);     // Utilisation de 'print' importé de redis
  client.hset(hashKey, 'Cali', 40, print);       // Utilisation de 'print' importé de redis
  client.hset(hashKey, 'Paris', 2, print);       // Utilisation de 'print' importé de redis
}

// Afficher le Hash avec hgetall
function displayHash() {
  const hashKey = 'HolbertonSchools';
  client.hgetall(hashKey, (err, obj) => {
    if (err) {
      console.log(`Error retrieving hash: ${err.message}`);
    } else {
      console.log(obj);
    }
  });
}

// Appel des fonctions
createHash();
displayHash();

