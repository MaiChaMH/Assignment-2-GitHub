const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://MaiChaMH:WxPJrX6jdE8ESNyN@mcmh-cluster.gl7yyrv.mongodb.net/DressStore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const Product = mongoose.model('Product', {
  name: String,
  description: String,
  price: Number,
  published: Boolean,
  category: String,
});

app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});
  
app.get('/api/products/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
});
  
app.post('/api/products', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
});
  
app.put('/api/products/:id', async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(product);
});
  
app.delete('/api/products/:id', async (req, res) => {
    await Product.findByIdAndRemove(req.params.id);
    res.json({ message: 'Product removed successfully' });
});
  
app.delete('/api/products', async (req, res) => {
    await Product.deleteMany({});
    res.json({ message: 'All products removed' });
});
  
app.get('/api/products', async (req, res) => {
    const keyword = req.query.name;
    const products = await Product.find({ name: { $regex: keyword, $options: 'i' } });
    res.json(products);
});

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the DressStore application.' });
});  

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
