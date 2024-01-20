const addQuantity = (req, res, db) => {
    const { product, price, name, quantity, id } = req.body.item;
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
            quantity: db.raw('cart_items.quantity + 1')
        })
        .returning('*')
        .then(cartItem => {
            res.json(cartItem[0]);
        })
        .catch(error => {
            console.error('Error adding item to cart:', error);
            res.status(500).json('Error adding item to cart');
        });
};

export default addQuantity;
