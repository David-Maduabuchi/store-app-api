const deleteAll = (req, res, db) => {
    const { user_id } = req.body;

    db('cart_items')
      .where({ user_id: user_id })
      .del()
      .then(() => {
        res.json({ message: 'All items deleted from cart' });
      })
      .catch(error => {
        console.error('Error deleting all items from cart:', error);
        res.status(500).json('Error deleting all items from cart');
      });
}
export default deleteAll;