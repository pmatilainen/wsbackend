var mongoose = require('mongoose');

/**
 * Schema defining the 'catalog' model.
 * NOTE: Should not be needed in proper implementation!
 */
var CatalogSchema = new mongoose.Schema({
    // list of items in catalog
	items: [{
		// product reference
		product: {
			ref:  'product',
			type: mongoose.Schema.Types.ObjectId
		},
		// amount of products in catalog
		stock: {
			type: Number,
			default: 1
		}
	}]
});

module.exports = mongoose.model('Catalog', CatalogSchema);
