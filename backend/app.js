const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const {uri} = require("./config/config");
const {addUser, loginUser, accessPortal, assignUserRoles, assignAccess, removeAccess} = require("./controllers/user.controllers");
const {getAllRepositories, getRepository, addCredentials, updateCredentials} = require("./controllers/unit.controller");

const app = express();

// Request.body access
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//Helmet
app.use(helmet());

mongoose.Promise = global.Promise;

/*The useMongoClient option was removed in Mongoose 5, it is now always true
https://mongoosejs.com/docs/migrating_to_5.html#connection-logic*/
mongoose.connect(uri);

mongoose.connection.on('error', function () {
  console.log('Connection to Mongo established.');
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
});

mongoose.connection.once('open', function () {
  console.log("Successfully connected to the database");
});

// User registration
app.post("/registration", addUser);

// User login
app.post("/login", loginUser);

// Portal access
app.get("/portal", accessPortal);

// Retrieve all credential repositories
app.get("/all-repositories", getAllRepositories);

// Retrieve a single division credential repository
app.post("/repository", getRepository);

// Add credentials to division's repository
app.post("/add-credentials", addCredentials);

// Update credentials 
app.put("/update-credentials", updateCredentials);

// Assign user roles
app.put("/assign-roles", assignUserRoles);

// Grant user access to organisational units and divisions
app.put("/assign-access", assignAccess);

// Remove user access from organisational units and divisions
app.put("/remove-access", removeAccess);

// Listen to port 8080
app.listen(8080, () => {
  console.log("Listening to port 8080.");
});