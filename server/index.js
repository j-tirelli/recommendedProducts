const express = require('express');
const RecommendedItem = require('../database/RecommendedItem.js');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const helpers = require('./helpers.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.get('/', (req, res) => {
  debugger;
  console.log('GOT a GET');
});

app.get('/products/dept/:dept', (req, res) => {
  helpers.getDept(req.params.dept, (err, results) => {
    res.json(results);
  });
});

app.get('/products/brand/:brandName', (req, res) => {
  helpers.getBrands(req.params.brandName, (err, results) => {
    res.json(results);
  });
});

app.get('/products/price/min=:minPrice&max=:maxPrice', (req, res) => {
  helpers.getPrices(req.params.minPrice, req.params.maxPrice, (err, results) => {
    res.json(results);
  });
});

app.get('/products/id/:productId', async (req, res) => {
  // debugger;
  RecommendedItem.findOne({ id: parseInt(req.params.productId) }, async (err, searchedProduct) => {
    console.log(searchedProduct);
    // debugger;
    let deptMatch = await axios.get(`http://localhost:3003/products/dept/${searchedProduct.department}`);
    let brandMatch = await axios.get(`http://localhost:3003/products/brand/${searchedProduct.brand}`);
    let priceMatch = await axios.get(`http://localhost:3003/products/price/min=${searchedProduct.price * 0.9}&max=${searchedProduct.price * 1.1}}`);

    const allResults = deptMatch.data.concat(brandMatch.data).concat(priceMatch.data);

    res.send(allResults);
  });

});


module.exports = app;
