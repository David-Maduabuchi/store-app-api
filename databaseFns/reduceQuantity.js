const reduceQuantity = (req, res, db) => {
    const { user_id, id } = req.body;

    db('cart_items')
      .where({
        user_id: user_id,
        id: id
      })
      .decrement('quantity', 1)
      .returning('*')
      .then(updatedCartItem => {
        if (updatedCartItem.length > 0) {
          const updatedQuantity = updatedCartItem[0].quantity;
  
          if (updatedQuantity < 1) {
            // If quantity becomes less than 1, delete the entire product
            return db('cart_items')
              .where({
                user_id: user_id,
                id: id
              })
              .del()
              .then(() => {
                res.json({ message: 'Product deleted from cart' });
              })
              .catch(error => {
                console.error('Error deleting product from cart:', error);
                res.status(500).json('Error deleting product from cart');
              });
          } else {
            res.json(updatedCartItem[0]);
          }
        } else {
          res.status(404).json({ error: 'Product not found in cart' });
        }
      })
      .catch(error => {
        console.error('Error reducing quantity:', error);
        res.status(500).json('Error reducing quantity');
      });
}

export default reduceQuantity;