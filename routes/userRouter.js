 const express = require('express');
 const route = express.Router();
 const AuthController = require("../controller/authController")
 
 route.post("/register", AuthController.register );
 route.post("/login", AuthController.login );
 route.post("/");
 route.get("/",  AuthController.getUsers);
 route.get("/test", AuthController.protected, (req, res) => {
    res.send("/User Valid");
  });
  route.put("/");
  route.delete("/");

module.exports = route;
