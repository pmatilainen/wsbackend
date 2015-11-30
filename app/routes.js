var path         = require('path');
var mongoose     = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var Cart    = require('./models/cart');
var Catalog = require('./models/catalog');
var Product = require('./models/product');

module.exports = function(app) {
    /**
     * Product
     */

     // get all products by name (TODO: descending)
     app.get('/api/products/name', function(req, res) {
        Product.find().sort({ name: 'ascending' }).exec(function(err, products) {
            err ? res.send(err) : res.json(products);
        });
     });

     // get all products by price (TODO: descending)
     app.get('/api/products/price', function(req, res) {
        Product.find().sort({ price: 'ascending' }).exec(function(err, products) {
            err ? res.send(err) : res.json(products);
        });
     });

     // get single product
     app.get('/api/products/:product_id', function(req, res) {
        Product.findById(req.params.product_id, function(err, product) {
            err ? res.send(err) : res.json(product);
        });
     });

     // create new product
     app.post('/api/products', function(req, res) {
        var product = new Product({
            name:  req.body.name,
            price: req.body.price,
            stock: req.body.stock
        });
        product.save(function(err) {
            err ? res.send(err) : res.json({ message: 'New product created' });
        });
     });

     // update product
     app.put('/api/products/:product_id', function(req, res) {
         Product.findById(req.params.product_id, function(err, product) {
            if(err) return res.send(err);
            if(req.body.name)  product.name  = req.body.name;
            if(req.body.price) product.price = req.body.price;
            if(req.body.stock) product.stock = req.body.stock;
            product.save(function(err) {
                err ? res.send(err) : res.json({ message: 'Product updated' })
            });
         });
     });

     // delete product
     app.delete('/api/products/:product_id', function(req, res) {
        Product.remove({
            _id: req.params.product_id
        }, function(err, product) {
            err ? res.send(err) : res.json({ message: 'Product deleted' });
        });
     });

    /**
     * Shopping cart
     */

    // get all carts (NOTE: not necessarily needed with proper user accounts)
    app.get('/api/carts', function(req, res) {
        Cart.find(function(err, carts) {
           err ? res.send(err) : res.json(carts);
        });
    });

    // get single cart
    app.get('/api/carts/:cart_id', function(req, res) {
        return Cart.findById(req.params.cart_id)
        .populate({
            path:  'items.product',
            model: 'Product'
        })
        .exec(function(err, cart) {
            if(err) return res.send(err);
            console.log(cart);
            return res.json(cart);
        });
    });

    // create new cart
    app.post('/api/carts', function(req, res) {
       var cart = new Cart({ items: [] });
       cart.save(function(err) {
           err ? res.send(err) : res.json({ message: 'New cart created' });
       });
    });

    // add item to cart
    app.put('/api/carts/:cart_id/add', function(req, res) {
        Cart.findById(req.params.cart_id, function(err, cart) {
           if(err) return res.send(err);
           if(req.body.productID) {
               var isInCart = false;
               for(var i = 0; i < cart.items.length; i++) {
                   if(cart.items[i]._id.toString() === req.body.productID) {
                       cart.items[i].inCart++;
                       isInCart = true;
                       break;
                   }
               }
               if(!isInCart) cart.items.push(req.body.productID);
           }
           cart.save(function(err) {
               err ? res.send(err) : res.json({ message: 'Cart updated' });
           });
       });
    });

    // remove item from cart
    app.put('/api/cart/:cart_id/remove', function(req, res) {
       Cart.findById(req.params.cart_id, function(err, cart) {
           if(err) return res.send(err);
           if(req.body.productID) {
               for(var i = 0; i < cart.items.length; i++) {
                   if(cart.items[i]._id.toString() === req.body.productID) {
                       cart.items[i].stock > 1
                           ? cart.items[i].inCart--
                           : cart.items.splice(i, 1);
                       break;
                   }
               }
           }
           cart.save(function(err) {
               err ? res.send(err) : res.json({ message: 'Cart updated' });
           });
       });
    });

    // delete cart
    app.delete('/api/carts/:cart_id', function(req, res) {
        Cart.remove({
            _id: req.params.cart_id
        }, function(err, product) {
           err ? res.send(err) : res.json({ message: 'Cart deleted' });
        });
    });

    /**
     * View routing
     */
	app.get('*', function(req, res) {
		res.sendFile(path.join(__dirname, '../app/views/index.html'));
	});


    // ---------------------------------------------------------------------------
    /**
     * Catalog (should not be needed)
     */

     // get all catalogs
     app.get('/api/catalogs', function(req, res) {
        Catalog.find(function(err, catalogs) {
            err ? res.send(err) : res.json(catalogs);
        });
     });

     // get single catalog
     app.get('/api/catalogs/:catalog_id', function(req, res) {
        Catalog.findById(req.params.catalog_id, function(err, catalog) {
            err ? res.send(err) : res.json(catalog);
        });
     });

     // create new catalog
     app.post('/api/catalogs', function(req, res) {
        var catalog = new Catalog({ items: [] });
        catalog.save(function(err) {
            err ? res.send(err) : res.json({ message: 'New catalog created' });
        });
     });

     // add item to catalog
     app.put('/api/catalogs/:catalog_id/add', function(req, res) {
         Catalog.findById(req.params.catalog_id, function(err, catalog) {
            if(err) return res.send(err);
            if(req.body.productID) {
                var isInCatalog = false;
                for(var i = 0; i < catalog.items.length; i++) {
                    if(catalog.items[i]._id.toString() === req.body.productID) {
                        catalog.items[i].stock++;
                        isInCatalog = true;
                        break;
                    }
                }
                if(!isInCatalog) catalog.items.push(req.body.productID);
            }
            catalog.save(function(err) {
                err ? res.send(err) : res.json({ message: 'Catalog updated' });
            });
        });
     });

     // remove item from catalog
     app.put('/api/catalogs/:catalog_id/remove', function(req, res) {
        Catalog.findById(req.params.catalog_id, function(err, catalog) {
            if(err) return res.send(err);
            if(req.body.productID) {
                for(var i = 0; i < catalog.items.length; i++) {
                    if(catalog.items[i]._id.toString() === req.body.productID) {
                        catalog.items[i].stock > 1
                            ? catalog.items[i].stock--
                            : catalog.items.splice(i, 1);
                        break;
                    }
                }
            }
            catalog.save(function(err) {
                err ? res.send(err) : res.json({ message: 'Catalog updated' });
            });
        });
     });

     // delete catalog
     app.delete('/api/catalogs/:catalog_id', function(req, res) {
         Catalog.remove({
             _id: req.params.catalog_id
         }, function(err, product) {
            err ? res.send(err) : res.json({ message: 'Catalog deleted' });
         });
     });

};
