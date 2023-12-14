// Declaración de Dependencias
var express = require("express");
var router = express.Router();
// Dependencias para trabajar con imágenes
var util = require("util");
var cloudinary = require("cloudinary").v2;
const uploader = util.promisify(cloudinary.uploader.upload);
//Declaración de los ficheros requeridos
var queryMessenger = require("./../models/queryMessenger");
//!!!!! Publications
/* Render de la pagina http://localhost:3000/jsPublications. */
router.get("/", async function (req, res, next) {
  console.log("CONSOLE.LOG: publications.js File - GET /jsPublications");
  var messagesPublicTable = await queryMessenger.getPublicMessages();
  console.log(messagesPublicTable);
  // Código que verifica si hay imagen asociada
  messagesPublicTable = messagesPublicTable.map((receivedmessages) => {
    if (receivedmessages.img_messenger) {
      const link_img_messenger = cloudinary.image(
        receivedmessages.img_messenger,
        {
          width: 75,
          height: 75,
          crop: "fill",
        }
      );
      return {
        ...receivedmessages,
        link_img_messenger,
      };
    } else {
      if (true) {
          link_img_messenger = cloudinary.url("no_image", {
          width: 75,
          height: 75,
          crop: "fill",
        });
      }
      return {
        ...receivedmessages,
        link_img_messenger,
      };
    }
  });
  // Render
  res.render("hbsPublications", {
    layout: "hbsLayoutPublic", 
    messagesPublicTable,
  });
});

module.exports = router;
