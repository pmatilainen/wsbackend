var mongoose     = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

/**
 * Schema defining the 'shopping cart' model.
 */
var CartSchema = new mongoose.Schema({
	/**
	 * Here could be a reference to user model which doesn't exist in this case.
	 * Basically a link to the right user account.
	 */

	// list of items in shopping cart
	items: [{
		// product reference
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref:  'Product'
		},
		// amount of products in shopping cart
		inCart: {
			type: Number,
			default: 1
		}
	}]
});

CartSchema.plugin(deepPopulate, {
	whitelist: [
		'items.products'
	]
});

module.exports = mongoose.model('Cart', CartSchema);
