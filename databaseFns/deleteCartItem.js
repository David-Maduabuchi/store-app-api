const deleteitem = (req, res, db) => {
    const { user_id, id } = req.body;

    db('cart_items')
      .where({
        user_id: user_id,
        id: id,
      })
      .del()
      .then(() => {
        res.json({ message: 'Deletion Success' })
      })
      .catch(err => {
        console.error('Error deleting product from Cart: ', err);
        res.status(500).json('Error Occured')
      });
}

export default deleteitem;