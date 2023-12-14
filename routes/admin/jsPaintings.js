// Declaración de Dependencias
var express = require("express");
var router = express.Router();
// Dependencias para trabajar con imágenes
var util = require("util");
var cloudinary = require("cloudinary").v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);
//Declaración de los ficheros requeridos
var queryPaintings = require("./../../models/queryPaintings");

//! Listar Pinturas
/* queryPainting.exports From Models
insertPaintings, getAllPaintings, getByIdPaintings,
modifyByIdPaintings, deleteByIdPaintings */
/* Render de la modificación de Pinturas http://localhost:3000/admin/jsPaintings - . */
router.get("/", async (req, res, next) => {
  console.log("CONSOLE.LOG: painting.js File - GET /admin/jsPaintings");
  var paintingsTable = await queryPaintings.getAllPaintings();
  // Código que verifica si hay imagen asociada
  paintingsTable = paintingsTable.map((paintings) => {
    if (paintings.img_paintings) {
      const link_img_paintings = cloudinary.image(paintings.img_paintings, {
        width: 75,
        height: 75,
        crop: "fill",
      });
      return {
        ...paintings,
        link_img_paintings,
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
        ...paintings,
        link_img_paintings,
      };
    }
  });
  // Render
  res.render("admin/hbsPaintSetup", {
    layout: "admin/hbsLayoutAdmin",
    paintingsTable,
    welcomeUser: req.session.nameFromDB,
  });
});
//! Eliminar una Pintura
// (Etapa de Escritura) http://localhost:3000/admin/jsPaintings/deletePaint.
router.get("/deletePaint/:id_paintings", async (req, res, next) => {
  console.log(
    "CONSOLE.LOG: setupAdmin.js File - GET /admin/jsPaintings/deletePaint"
  );
  var idTag = req.params.id_paintings;
  let paint = await queryPaintings.getByIdPaintings(idTag);
  if (paint.img_paintings) {
    await destroy(paint.img_paintings);
  }
  await queryPaintings.deleteByIdPaintings(idTag);
  res.redirect("/admin/jsPaintings");
});
//! Modificar una Pintura
// (Etapa de Lectura) http://localhost:3000/admin/jsPaintings/modifyPaint/ - .
router.get("/modifyPaint/:id_paintings", async (req, res, next) => {
  console.log(
    "CONSOLE.LOG: setupAdmin.js File - GET /admin/jsPaintings/modifyPaint"
  );
  var idTag = req.params.id_paintings;
  var paint = await queryPaintings.getByIdPaintings(idTag);
  if (paint.public_paintings == "Yes") {
    var public = "checked";
  } else {
    var public = "";
  }
  res.render("admin/hbsPaintModify", {
    layout: "admin/hbsLayoutAdmin",
    welcomeUser: req.session.nameFromDB,
    paint,
    public,
  });
});

// (Etapa de Escritura) http://localhost:3000/admin/jsPaintings/modifyPaint/.
router.post("/modifyPaint", async (req, res, next) => {
  console.log(
    "CONSOLE.LOG: setupAdmin.js File - POST /admin/jsPaintings/modifyPaint"
  );
  try {
    let img_paintings = req.body.code_img_paintings;
    let check_public_paintings = req.body.check_public_paintings;
    if (check_public_paintings) {
      public_paintings = "Yes";
    } else {
      public_paintings = "No";
    }
    let delete_image_origin = false;
    if (req.body.img_delete === "1") {
      img_paintings = null;
      delete_image_origin = true;
    } else {
      if (req.files && Object.keys(req.files).length > 0) {
        new_img_paintings = req.files.new_img_paintings;
        img_paintings = (await uploader(new_img_paintings.tempFilePath))
          .public_id;
        delete_image_origin = true;
      }
    }
    if (delete_image_origin && req.body.code_img_paintings) {
      await destroy(req.body.code_img_paintings);
    }
    if (img_paintings = "null") {
      img_paintings = "no_image";
    }
    var paint = {
      // public_paintings: req.body.public_paintings,
      public_paintings,
      name_paintings: req.body.name_paintings,
      img_paintings,
    };
    var idTag = req.body.id_paintings;
    await queryPaintings.modifyByIdPaintings(paint, idTag);
    res.redirect("/admin/jsPaintings");
  } catch (error) {
    console.log("CATCH ERROR N°: ", error);
    res.render("admin/hbsPaintModify", {
      layout: "admin/hbsLayoutAdmin",
      welcomeUser: req.session.nameFromDB,
      error: true,
      paint: "We can't Modify the Data Message",
    });
  }
});
//! Nueva Pintura
/* (Etapa de Lectura) http://localhost:3000/admin/jsPaintings/newPaint. */
router.get("/newPaint", (req, res, next) => {
  console.log(
    "CONSOLE.LOG: setupAdmin.js File - GET /admin/jsPaintings/newPaint"
  );
  res.render("admin/hbsPaintNew", {
    layout: "admin/hbsLayoutAdmin",
    welcomeUser: req.session.nameFromDB,
  });
});
// (Etapa de Escritura) http://localhost:3000/admin/jsPaintings/newPaint.
router.post("/newPaint", async (req, res, next) => {
  console.log(
    "CONSOLE.LOG: setupAdmin.js File - POST /admin/jsPaintings/newPaint"
  );
  try {
    if (req.body.name_paintings != "") {
      let check_public_paintings = req.body.check_public_paintings;
      if (check_public_paintings) {
        public_paintings = "Yes";
      } else {
        public_paintings = "No";
      }
      let img_paintings = req.body.img_paintings;
      if (req.files && Object.keys(req.files).length > 0) {
        new_img_paintings = req.files.new_img_paintings;
        img_paintings = (await uploader(new_img_paintings.tempFilePath))
          .public_id;
      }
      var paint = {
        public_paintings,
        name_paintings: req.body.name_paintings,
        img_paintings,
      };
      //var idTag = req.body.id_paintings;
      //      await queryPaintings.modifyByIdPaintings(paint, idTag);
      await queryPaintings.insertPaintings(paint);
      //await queryPaintings.insertPaintings(req.body);
      res.redirect("/admin/jsPaintings");
    } else {
      res.render("admin/hbsPaintNew", {
        layout: "admin/hbsLayoutAdmin",
        welcomeUser: req.session.nameFromDB,
        error: true,
        message: "You need to complete all Tags before Save",
      });
    }
  } catch (error) {
    console.log("CATCH ERROR N°: ", error);
    res.render("admin/hbsPaintNew", {
      layout: "admin/hbsLayoutAdmin",
      welcomeUser: req.session.nameFromDB,
      error: true,
      message: "We can't Save the new Paint",
    });
  }
});
//! Exportar
module.exports = router;
