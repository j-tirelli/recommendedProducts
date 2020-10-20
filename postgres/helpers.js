const db = require('./connection.js');

const formatName = (string) => {
  return string[0].toUpperCase() + string.split('').slice(1).join('');
};

const getLikeDept = async (dept) => {
  let department = formatName(dept);
  const { rows } = await db.query('SELECT * FROM item WHERE department = $1 LIMIT 100', [department])
  return rows;
};

const getLikeBrands = async (brandName) => {
  const { rows } = await db.query('SELECT * FROM item WHERE brand = $1 LIMIT 100', [brandName])
  return rows;
};

const getLikePrices = async (gte = 0, lte = 1000) => {
  const { rows } = await db.query('SELECT * FROM item WHERE price <= $1 AND price >= $2', [lte, gte])
  return rows;
};

const getProduct = async (id, callback = (result) => result) => {
  id = parseInt(id);
  const { rows } = await db.query('SELECT * FROM item WHERE id = $1', [id]);
  return rows[0];
}

const deleteProduct = async (id) => {
  id = parseInt(id);
  await db.query('DELETE FROM item WHERE id = $1', [id]);
}

const createProduct = async ({ title, brand, department, price, imageUrl, productUrl }) => {
  const { result } = await db.query('INSERT INTO item (title, brand, department, price, imageUrl, productUrl) VALUES ($1, $2, $3, $4, $5, $6)', [title, brand, department, price, imageUrl, productUrl]);
}

const updateProduct = async ({ id, title, brand, department, price, imageUrl, productUrl }) => {
  id = parseInt(id);
  await db.query('UPDATE item SET title = $1, brand = $2, department = $3, price = $4, imageUrl = $5, productUrl = $6 WHERE id = $7', [title, brand, department, price, imageUrl, productUrl, id]);
}

module.exports.getLikeDept = getLikeDept;
module.exports.getLikeBrands = getLikeBrands;
module.exports.getLikePrices = getLikePrices;
module.exports.getProduct = getProduct;
module.exports.deleteProduct = deleteProduct;
module.exports.createProduct = createProduct;
module.exports.updateProduct = updateProduct;