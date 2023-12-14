"use strict";
// Declaración de Dependencias
var express = require("express");
var router = express.Router();
const app = express();
app.use(express.json({ limit: "7mb" }));
app.use(express.urlencoded({ limit: "7mb", extended: true }));
// Dependencias para trabajar con imágenes
var util = require("util");
var cloudinary = require("cloudinary").v2;
const uploader = util.promisify(cloudinary.uploader.upload);
// Dependencia necesaria para el envío de correos
//! (Habilitar para uso de mails) var nodemailer = require("nodemailer");
//Declaración de los ficheros requeridos
var queryMessenger = require("./../models/queryMessenger");
var queryPaintings = require("./../models/queryPaintings");
var queryPoems = require("./../models/queryPoems");

//! Router GET para traspaso al Frontend de los Mensajes.
router.get("/messages", async function (req, res, next) {
  console.log("CONSOLE.LOG api.js File - GET /messages");
  var messagesPublicTable = await queryMessenger.getPublicMessages();
  // Código que verifica si hay imagen asociada
  messagesPublicTable = messagesPublicTable.map(
    (receivedmessages, link_img_messenger) => {
      if (receivedmessages.img_messenger) {
        const link_img_messenger = cloudinary.url(
          receivedmessages.img_messenger,
          {
            width: 960,
            height: 600,
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
            width: 960,
            height: 600,
            crop: "fill",
          });
        }
        return {
          ...receivedmessages,
          link_img_messenger,
        };
      }
    }
  );
  res.json(messagesPublicTable);
});

//! Router POST para traspaso del Frontend al Backend de los Mensajes.
router.post("/contact", async (req, res) => {
  console.log("CONSOLE.LOG api.js File - POST /contact/message");
  try {
    const objMessage = req.body.objText;
    const fileStr = req.body.file;
    objMessage.img_messenger = "no_image";
    if (fileStr) {
      const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: "dev_setups",
      });
      objMessage.img_messenger = uploadedResponse.public_id;
    }
    await queryMessenger.insertMessenger({
      name_messenger: objMessage.name_messenger,
      email_messenger: objMessage.email_messenger,
      content_messenger: objMessage.content_messenger,
      img_messenger: objMessage.img_messenger,
      public_messenger: "Yes",
    });
    res.json({ msg: "La imagen se cargo correctamente" });
  } catch (error) {
    console.log("CATCH ERROR N°: ", error);
    res.status(500).json({ err: "Error de carga de imagen" });
  }
});

//! Router GET para traspaso al Frontend de las Pinturas.
router.get("/paintings", async function (req, res, next) {
  console.log("CONSOLE.LOG api.js File - GET /paintings");
  var paintingsPublicTable = await queryPaintings.getPublicPaintings();
  // Código que verifica si hay imagen asociada
  paintingsPublicTable = paintingsPublicTable.map(
    (paintings, link_img_paintings) => {
      if (paintings.img_paintings) {
        const link_img_paintings = cloudinary.url(paintings.img_paintings, {
          crop: "fill",
        });
        return {
          ...paintings,
          link_img_paintings,
        };
      } else {
        if (true) {
          link_img_paintings = cloudinary.url("no_image", {
            width: 250,
            height: 500,
            crop: "fill",
          });
        }
        return {
          ...paintings,
          link_img_paintings,
        };
      }
    }
  );
  res.json(paintingsPublicTable);
});

//! Router GET para traspaso al Frontend de los Poemas.
router.get("/poems", async function (req, res, next) {
  console.log("CONSOLE.LOG api.js File - GET /poems");
  var poemsPublicTable = await queryPoems.getPublicPoems();
  // Código que verifica si hay imagen asociada
  poemsPublicTable = poemsPublicTable.map((poems, link_img_poems) => {
    if (poems.img_poems) {
      const link_img_poems = cloudinary.url(poems.img_poems, {
        crop: "fill",
      });
      return {
        ...poems,
        link_img_poems,
      };
    } else {
      if (true) {
        link_img_poems = cloudinary.url("no_image", {
          width: 100,
          height: 100,
          crop: "fill",
        });
      }
      return {
        ...poems,
        link_img_poems,
      };
    }
  });
  res.json(poemsPublicTable);
});
//! Envío Correos desde la Pagina Web
/* Router POST para el envío de e-mails. */
/* //! Deshabilitado desde Aquí
router.post("/contact", async (req, res) => {
  const mail = {
    to: "arecco.p@gmail.com",
    subject: "Memsaje desde la Pagina Web",
    html: `${req.body.name_messenger} se contacto a traves de la web.<br/>
     Quiere dejar este mensaje: ${req.body.content_messenger}.<br/> Su correo
      es el:${req.body.email_messenger}.`,
  };
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    //secure: true,
    auth: {
      user: "fa9cdc8ad8b113",
      pass: "ab7354e711d0bc",
    },
  });
  await transport.sendMail(mail);
  res.status(201).json({
    error: false,
    //message: "Message Sended",
  });
});
*/ //! Hasta Aquí
module.exports = router;
