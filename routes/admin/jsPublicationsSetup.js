// Declaración de Dependencias
var express = require("express");
var router = express.Router();
// Dependencias para trabajar con imágenes
var util = require("util");
var cloudinary = require("cloudinary").v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);
//Declaración de los ficheros requeridos
var queryMessenger = require("./../../models/queryMessenger");

//! Listar Mensajes
/* Render de la modificación de Publicaciones.  http://localhost:3000/admin/jsAdminSetup/setupPublications - */
router.get("/", async (req, res, next) => {
  console.log("CONSOLE.LOG: setupAdmin.js File - GET /admin/setupPublications");
  var messengerPublicTable = await queryMessenger.getAllMessages();
  // Código que verifica si hay imagen asociada
  messengerPublicTable = messengerPublicTable.map((receivedmessages) => {
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
  res.render("admin/hbsPublicationsAdmin", {
    layout: "admin/hbsLayoutAdmin",
    messengerPublicTable,
    welcomeUser: req.session.nameFromDB,
  });
});
//! Eliminar un Mensaje
// (Etapa de Escritura) http://localhost:3000/admin/setupPublications.
router.get("/deletePub/:id_messenger", async (req, res, next) => {
  console.log(
    "CONSOLE.LOG: setupAdmin.js File - GET /admin/jsPublicationsSetup/deletePub"
  );
  var idTag = req.params.id_messenger;
  let message = await queryMessenger.getByIdMessages(idTag);
  if (message.img_messenger) {
    await destroy(message.img_messenger);
  }
  await queryMessenger.deleteByIdMessages(idTag);
  res.redirect("/admin/jsPublicationsSetup");
});

//! Modificar una Mensaje
// (Etapa de Lectura)  http://localhost:3000/admin/jsAdminSetup/setupPublications.
router.get("/modifyPub/:id_messenger", async (req, res, next) => {
  console.log(
    "CONSOLE.LOG: setupAdmin.js File - GET /admin/jsPublicationsSetup/modifyPub"
  );
  var idTag = req.params.id_messenger;
  var userMessage = await queryMessenger.getByIdMessages(idTag);
  if (userMessage.public_messenger == "Yes") {
    var public = "checked";
  } else {
    var public = "";
  }
  res.render("admin/hbsPublicationsModify", {
    layout: "admin/hbsLayoutAdmin",
    welcomeUser: req.session.nameFromDB,
    userMessage,
    public,
  });
});

// (Etapa de Escritura) http://localhost:3000/admin/jsAdminSetup/modifyPub.
router.post("/modifyPub", async (req, res, next) => {
  console.log(
    "CONSOLE.LOG: setupAdmin.js File - POST /admin/jsPublicationsSetup/modifyPub"
  );
  try {
    let check_public_message = req.body.check_public_message;
    if (check_public_message) {
      public_messenger = "Yes";
    } else {
      public_messenger = "No";
    }
    let img_messenger = req.body.code_img_messenger;
    let delete_image_origin = false;
    if (req.body.img_delete === "1") {
      img_messenger = null;
      delete_image_origin = true;
    } else {
      if (req.files && Object.keys(req.files).length > 0) {
        new_img_messenger = req.files.new_img_messenger;
        img_messenger = (await uploader(new_img_messenger.tempFilePath))
          .public_id;
        delete_image_origin = true;
      }
    }
    if (delete_image_origin && req.body.code_img_messenger) {
      await destroy(req.body.code_img_messenger);
    }
    if ((img_messenger = "null")) {
      img_messenger = "no_image";
    }
    var userMessage = {
      content_messenger: req.body.content_messenger,
      name_messenger: req.body.name_messenger,
      email_messenger: req.body.email_messenger,
      public_messenger,
      img_messenger,
    };
    var idTag = req.body.id_messenger;
    await queryMessenger.modifyByIdMessages(userMessage, idTag);
    res.redirect("/admin/jsPublicationsSetup");
  } catch (error) {
    console.log("CATCH ERROR N°: ", error);
    res.render("admin/hbsPublicationsModify", {
      layout: "admin/hbsLayoutAdmin",
      welcomeUser: req.session.nameFromDB,
      error: true,
      message: "We can't Modify the Data Message",
    });
  }
});
//! Exportar
module.exports = router;
