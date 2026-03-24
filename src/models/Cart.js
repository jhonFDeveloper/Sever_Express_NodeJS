const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema({
    products: [
        {
            product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, default: 1 }
        }
    ]
});

const Cart = mongoose.model('Cart', carritoSchema);

module.exports = Cart;
