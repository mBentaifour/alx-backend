import express from 'express';
import redis from 'redis';
import kue from 'kue';
import { promisify } from 'util';

// Create express app and Redis client
const app = express();
const port = 1245;

const client = redis.createClient();
client.on('error', (err) => console.log('Redis Client Error', err));

const queue = kue.createQueue();

// Promisify Redis methods for async/await
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Initialize available seats to 50 in Redis
async function reserveSeat(number) {
  await setAsync('available_seats', number);
}

// Get current available seats
async function getCurrentAvailableSeats() {
  const seats = await getAsync('available_seats');
  return seats ? parseInt(seats, 10) : 0;
}

// Set initial state
let reservationEnabled = true;
reserveSeat(50); // Set initial available seats to 50

// Routes

// Get available seats
app.get('/available_seats', async (req, res) => {
  const availableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: availableSeats.toString() });
});

// Reserve a seat
app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservations are blocked' });
  }

  const job = queue.create('reserve_seat', {})
    .save((err) => {
      if (err) {
        return res.json({ status: 'Reservation failed' });
      }
      res.json({ status: 'Reservation in process' });
    });
});

// Process the reservation queue
app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  const availableSeats = await getCurrentAvailableSeats();

  if (availableSeats <= 0) {
    reservationEnabled = false;
  }

  queue.process('reserve_seat', async (job, done) => {
    try {
      const availableSeats = await getCurrentAvailableSeats();
      if (availableSeats <= 0) {
        throw new Error('Not enough seats available');
      }
      
      await reserveSeat(availableSeats - 1);

      if (availableSeats - 1 === 0) {
        reservationEnabled = false;
      }

      done();
    } catch (error) {
      done(error);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

