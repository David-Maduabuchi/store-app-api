const addToCart = (req, res, db) => {
  const { product, price, name, quantity, id } = req.body.item;
  console.log('request :', req.body.item)
  db('cart_items')
    .insert({
      user_id: req.body.user_id,
      id: id,
      quantity: quantity,
      price: price,
      product: product,
      name: name
    })
    .onConflict(['user_id', 'id'])
    .merge({
      quantity: db.raw('cart_items.quantity + EXCLUDED.quantity ')
    })
    .returning('*')
    .then(cartItem => {
      console.log('response: ', cartItem[0]);
      res.json(cartItem[0]);
    })
    .catch(error => {
      console.error('Error adding item to cart:', error);
      res.status(500).json('Error adding item to cart');
    });
};

export default addToCart;
