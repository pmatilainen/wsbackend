var mongoose = require('mongoose');

/**
 * Schema defining the 'product' model.
 */
var ProductSchema = new mongoose.Schema({
    // name for the product
	name: {
		type:    String,
		default: ''
	},
    // price for the product
    price: {
		type:    Number,
		default: 0
	},
    // amount of products in stock
    stock: {
        type:    Number,
        default: 0,
    }
});

module.exports = mongoose.model('Product', ProductSchema);
