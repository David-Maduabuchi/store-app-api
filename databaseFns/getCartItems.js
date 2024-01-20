const getCartItems = (req, res, db) => {
  const userId = req.params.userId
  db.select('id', 'name', 'price', 'quantity', 'product')
    .from('cart_items')
    .where('user_id', '=', userId)
    .then(cartItems => {
      res.json(cartItems);
    })
    .catch(error => {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ error: 'Error fetching cart items' });
    });
}

export default getCartItems;