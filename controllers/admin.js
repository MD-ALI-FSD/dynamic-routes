//Importing "Product" Class to save and retrive data
const Product = require("../models/product");

//Exporting middleware to be used in "route/admin.js" to render(get) add-products page on path "/add-product using template "views/admin/edit-product.ejs".
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

//Exporting middleware to be used in "route/admin.js" to POST DATA from path "/admin/add-product" and create a new product object using "models/product.js/Product.save".
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

//Exporting middleware to be used in "route/admin.js" to render page "/admin/edit-product" with data of that product using "query-params"  and displays it using template "views/admin/edit-product.ejs"
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
};

//Exporting middleware to be used in "route/admin.js" to render page "/admin/products" with  edited product which has been created using "models/product.js/Product.save" and data from "req.body" and displays it using template "views/admin/product.ejs"
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice
  );
  updatedProduct.save();
  res.redirect("/admin/products");
};

//Exporting middleware to be used in "route/admin.js" to render page "/admin/products" to render all products which are frtched using "models/product.js/Product.fetchAll(cb)"  and displays them using template "views/admin/edit-product.ejs"
exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};

//Exporting middleware to be used in "router/admin.js" to delete a product using "model/product.js/Product.deleteById(id)" which gets products id via req.body.
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect("/admin/products");
};
