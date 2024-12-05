import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

const app = express();
const port = 1245;

// Data: list of products
const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 },
];

// Create Redis client
const client = redis.createClient();
client.on('error', (err) => console.log('Redis Client Error', err));

// Promisify Redis commands for async/await
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Function to get product by ID
function getItemById(id) {
  return listProducts.find(product => product.itemId === id);
}

// Reserve stock by ID
async function reserveStockById(itemId, stock) {
  await setAsync(`item.${itemId}`, stock);
}

// Get current reserved stock
async function getCurrentReservedStockById(itemId) {
  const stock = await getAsync(`item.${itemId}`);
  return stock ? parseInt(stock, 10) : 0;
}

// Routes
app.get('/list_products', (req, res) => {
  res.json(listProducts.map(product => ({
    itemId: product.itemId,
    itemName: product.itemName,
    price: product.price,
    initialAvailableQuantity: product.initialAvailableQuantity,
  })));
});

app.get('/list_products/:itemId', async (req, res) => {
  const product = getItemById(parseInt(req.params.itemId));
  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }
  const currentStock = await getCurrentReservedStockById(product.itemId);
  res.json({
    itemId: product.itemId,
    itemName: product.itemName,
    price: product.price,
    initialAvailableQuantity: product.initialAvailableQuantity,
    currentQuantity: product.initialAvailableQuantity - currentStock,
  });
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const product = getItemById(parseInt(req.params.itemId));
  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const currentStock = await getCurrentReservedStockById(product.itemId);

  if (currentStock >= product.initialAvailableQuantity) {
    return res.status(400).json({ status: 'Not enough stock available', itemId: product.itemId });
  }

  await reserveStockById(product.itemId, currentStock + 1);
  res.json({ status: 'Reservation confirmed', itemId: product.itemId });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

