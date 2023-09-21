const fs = require("fs");
const path = require("path");
//setting a path
const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

//class to store/manupulate data in "data/cart.json"
module.exports = class Cart {
  //Being called from "controllers/shop.js" to add a product or increase quantity in "data/cart.json"
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      //Analyze the cart => find existing product and then //Add new product/increase quantity
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // If existing the just increment the quantity of that particular product
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        //else add that new product
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  //to delete product from the cart by manupulating data in "data/cart.json"
  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      //nothing in cart
      if (err) {
        return;
      }
      //data from the cart file
      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find((prod) => prod.id === id);
      if (!product) {
        return;
      }
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQty;

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  //Being called from "controllers/shop.js" to fetch data from "data/cart.json"
  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        return cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
