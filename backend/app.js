const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

SINGLE_APP_DEPLOYMENT = true;

// mongodb credentials: user: admin_mean, pw: YnRnnv8rbBm24Be6
/*
Debug with Mongo Shell client
./mongo "mongodb+srv://cluster0.cw3t7.mongodb.net/meanDb" --username admin_mean
use node meanDb
show collections
db.posts.find()
*/
const user = 'admin_mean';
//const password = 'YnRnnv8rbBm24Be6';
var password = process.env.MONGO_ATLAS_PW;
var secret = process.env.JWT_KEY;
const databaseName = 'meanDb';

if (password == undefined)
{
  //console.log('Error - Database password not set');
  console.log('Warning - Use default Database password');
  password = 'YnRnnv8rbBm24Be6';
  //exit;
}
if (secret == undefined){
  //console.log('Error - Database secret not set');
  console.log('Warning - Use default Database secret');
  secret = 'secret_this_should_be_longer';
  process.env.JWT_KEY = secret;
  //exit;
}
console.log('Database Security parameters: ');
console.log(' - Database name: ' + databaseName);
console.log(' - Database user: ' + user);
console.log(' - Database password: ' + password);
console.log(' - Database secret: ' + process.env.JWT_KEY);

const mongoDbConnectStr = 'mongodb+srv://' + user + ':' + password +
'@cluster0.cw3t7.mongodb.net/' + databaseName +
'?retryWrites=true&w=majority';
console.log('Mongo connect: ' + mongoDbConnectStr);
mongoose.connect(mongoDbConnectStr)
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((err) => {
    console.log('Connection to database failed!: ' + err);
  });

app.use(bodyParser.json());
// url parsing is not used by our app - just an example more
app.use(bodyParser.urlencoded({ extended: false }));

if (SINGLE_APP_DEPLOYMENT) {
  app.use("/", express.static(path.join(__dirname, "angular")));
}

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
imagePath = path.join(__dirname, "images");
console.log("Images redirected to: " + imagePath);
app.use("/image", express.static(imagePath));
app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);
// Used if app is deployed from here too
if (SINGLE_APP_DEPLOYMENT) {
  app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "angular", "index.html"));
  });
}
module.exports = app;
