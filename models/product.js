const fs = require("fs");
const path = require("path");

const Cart = require("./cart");

//setting a path
const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

//Explanation of the below used "getProductsFromFile" callBack function
// So you have understood till an object is created, right? That object is in constant product. At product.save, you reach save().
// 1. getProductsFromFile takes a callback function. In the sense, when getProductsFromFile has completed its execution, it will call an anonymous function.
// 2. Once the getProductFromFile has completed the task of either creating an empty array or parsing the existing array, the result is passed to callback function. { i.e., cb([]) or cb(JSON.parse(filecontent)) }
// 3. Now back to save(), in the anonymous function we have defined. products argument has the empty array or parsed file now.
// 4. To that empty arr or parsed filecontent, you are pushing this, and this points to the object you just created ( Only when you use arrow syntax )
// 5.   writeFile now takes the updated array and writes it to the file.

//helper function to get data from file
const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

//Class to creat an object of data entered.
module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    //id to check later whether its a new product or edited one
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
  //saving data on a new product being added by the user.
  save() {
    getProductsFromFile((products) => {
      //checking whether edited product
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        //If new product
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }
  // Deleting an
  static deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id);
      const updatedProducts = products.filter((prod) => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }
  //fetching all products
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
  //finding a particular product by id
  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }
};
