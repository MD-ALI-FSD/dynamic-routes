//Controller for product

//Importing models to save and retrive data
const Product = require("../models/product");
const Cart = require("../models/cart");

//Exporting middleware to be used in "route/shop.js" to render page "/products" to display all products which are fetched using "models/product.js/Product.fetchAll(cb)"  and displays them using template "views/shop/product-list.ejs"
exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

//Exporting middleware to be used in "route/shop.js" to render page "/products/product-id" to display details of a particular product which are fetched using "models/product.js/Product.findById(id,cb)" id is fetched using "req.params.productId" and displays them using template "views/shop/product-detail.ejs"
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  });
};

//to fetch index of a particular product
exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

//Exporting middleware to be used in "route/shop.js" to render page "/cart" to display items of the cart which are fetched using "models/cart.js/Product.getCart(cb)" .roductId" and displays them using template "views/shop/cart.ejs"
exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({
            productData: product,
            qty: cartProductData.qty,
          });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
};

//Exporting middleware to be used in "route/shop.js" to redirect to page "/cart" after adding items to  the cart which are found using "models/product.js/Product.findById(id,cb)" and added in the cart using callback function  "models/cart.js/Cart.addProduct(id,price)" and displays them using template "views/shop/cart.ejs".
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

//Exporting middleware to be used in "route/shop.js" to redirect to page "/cart" after deleting items from  the cart which are found using "models/product.js/Product.findById(id,cb)" and from  the cart using callback function  "models/cart.js/Cart.deleteProduct(id,price)" and displays them using template "views/shop/cart.ejs".
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

//Not being used
exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

//not being used
exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
