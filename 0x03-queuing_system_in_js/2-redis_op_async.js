import { createClient } from 'redis';
import { promisify } from 'util';

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

// Promisifier la méthode get
const getAsync = promisify(client.get).bind(client);

// Fonction pour définir une nouvelle école dans Redis
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, (err, reply) => {
    if (err) {
      console.error(`Error setting value for ${schoolName}: ${err.message}`);
    } else {
      console.log(`Reply: ${reply}`);
    }
  });
}

// Fonction asynchrone pour afficher la valeur d'une école
async function displaySchoolValue(schoolName) {
  try {
    const value = await getAsync(schoolName); // Utilisation de await avec la promesse retournée par getAsync
    console.log(value); // Afficher la valeur obtenue
  } catch (err) {
    console.error(`Error retrieving value for ${schoolName}: ${err.message}`);
  }
}

// Appels de fonction
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');

