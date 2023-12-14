// Declaración de Dependencias
var express = require("express");
var router = express.Router();
// Dependencias para trabajar con imágenes
var util = require("util");
var cloudinary = require("cloudinary").v2;
const uploader = util.promisify(cloudinary.uploader.upload);
//var md5 = require("md5");

//Declaración de los ficheros requeridos
var queryMessenger = require("./../models/queryMessenger");

//! Render de la pagina http://localhost:3000/jsMessenger. */
router.get("/", function (req, res, next) {
  console.log("CONSOLE.LOG: messenger.js File - GET /jsMessenger");
  res.render("hbsMessenger", {
    layout: "hbsLayoutPublic",
  });
});

//! Redirect a la pagina http://localhost:3000/. */
router.post("/", async (req, res, next) => {
  console.log("CONSOLE.LOG: messenger.js File - POST /jsMessenger");
  try {
    var img_messenger = "no_image";
    if (req.files && Object.keys(req.files).length > 0) {
      var image_up = req.files.img_messenger;
      img_messenger = (await uploader(image_up.tempFilePath)).public_id;
    }
    if (req.body.name_messenger != "" && req.body.content_messenger != "") {
      await queryMessenger.insertMessenger({
        ...req.body, //
        img_messenger,
        public_messenger: "Yes",
      });
      res.redirect("/");
    } else {
      res.render("hbsMessenger", {
        layout: "hbsLayoutPublic",
        error: true,
        message: "You need to complete all Tags before Save",
      });
    }
  } catch (error) {
    console.log("CATCH ERROR N°: ", error);
    res.render("/", {
      layout: "hbsLayoutPublic",
      error: true,
      message: "We can't Save the Message",
    });
  }
});

module.exports = router;
