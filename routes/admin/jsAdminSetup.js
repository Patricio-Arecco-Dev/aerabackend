// Declaración de Dependencias
var express = require("express");
var router = express.Router();
var md5 = require("md5");
// Dependencias para trabajar con imágenes
var util = require("util");
var cloudinary = require("cloudinary").v2;
//const uploader = util.promisify(cloudinary.uploader.upload);
//const destroy = util.promisify(cloudinary.uploader.destroy);
//Declaración de los ficheros requeridos
var queryUsersPublics = require("./../../models/queryUsersPublics");
var queryMessenger = require("./../../models/queryMessenger");

/* Render de la pagina http://localhost:3000/admin/jsAdminSetup. */
router.get("/", async function (req, res, next) {
  console.log("CONSOLE.LOG: setupAdmin.js File - GET /admin/jsAdminSetup");
  var usersPublicTable = await queryUsersPublics.getAllUsersPublics();
  res.render("admin/hbsAdminSetup", {
    layout: "admin/hbsLayoutAdmin", 
    welcomeUser: req.session.nameFromDB,
    usersPublicTable,
  });
});

module.exports = router;
