const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

//importing error controller "error404"
const errorController = require("./controllers/error");

const app = express();

//setting templating engine
app.set("view engine", "ejs");
app.set("views", "views");

//Importing routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

//using bodyparser and path
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//Using routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);

//if page not found
app.use(errorController.get404);

app.listen(3000);
