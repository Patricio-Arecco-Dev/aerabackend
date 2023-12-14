// Declaración de Dependencias
var express = require("express");
var router = express.Router();
// Dependencias para trabajar con imágenes
var util = require("util");
var cloudinary = require("cloudinary").v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);
//Declaración de los ficheros requeridos
var queryPoems = require("./../../models/queryPoems");

//! Listar Poemas
/* queryPoems.exports From Models
insertPoems, getAllPoems, getByIdPoems,
modifyByIdPoems, deleteByIdPoems */
/* Render de la modificación de Poemas http://localhost:3000/admin/jsPoems. */
router.get("/", async (req, res, next) => {
  console.log(
    "CONSOLE.LOG: setupAdmin.js File - GET /admin/jsPoems"
  );
  var poemsTable = await queryPoems.getAllPoems();
  // Código que verifica si hay imagen asociada
  poemsTable = poemsTable.map((poems) => {
    if (poems.img_poems) {
      const link_img_poems = cloudinary.image(poems.img_poems, {
        width: 75,
        height: 75,
        crop: "fill",
      });
      return {
        ...poems,
        link_img_poems,
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
        ...poems,
        link_img_poems,
      };
    }
  });
  // Render
  res.render("admin/hbsPoemSetup", {
    layout: "admin/hbsLayoutAdmin", 
    poemsTable,
    welcomeUser: req.session.nameFromDB,
  });
});
//! Eliminar un Poema
// (Etapa de Escritura) http://localhost:3000/admin/jsPoems/deletePoem.
router.get("/deletePoem/:id_poems", async (req, res, next) => {
  console.log("CONSOLE.LOG: setupAdmin.js File - GET /admin/jsPoems/deletePoem");
  var idTag = req.params.id_poems;
  let poem = await queryPoems.getByIdPoems(idTag);
  if (poem.img_poems) {
    await destroy(poem.img_poems);
  }
  await queryPoems.deleteByIdPoems(idTag);
  res.redirect("/admin/jsPoems");
});

//! Modificar un poema
// (Etapa de Lectura) http://localhost:3000/admin/jsAdminSetup/setupPoems.
router.get("/modifyPoem/:id_poems", async (req, res, next) => {
  console.log(
    "CONSOLE.LOG: setupAdmin.js File - GET /admin/jsAdminSetup/setupPoems/modifyPoem"
  );
  var idTag = req.params.id_poems;
  var poem = await queryPoems.getByIdPoems(idTag);
  if (poem.public_poems == "Yes") {
    var public = "checked";
  } else {
    var public = "";
  }
  res.render("admin/hbsPoemModify", {
    layout: "admin/hbsLayoutAdmin", 
    welcomeUser: req.session.nameFromDB,
    poem,
    public,
  });
});

// (Etapa de Escritura) http://localhost:3000/admin/jsAdminSetup/setupPoems.
router.post("/modifyPoem", async (req, res, next) => {
  console.log(
    "CONSOLE.LOG: setupAdmin.js File - POST /admin/jsAdminSetup/setupPoems/modifyPoem"
  );
  try {
    let img_poems = req.body.code_img_poems;
    let check_public_poems = req.body.check_public_poems;
    if (check_public_poems) {
      public_poems = "Yes";
    } else {
      public_poems = "No";
    }
    let delete_image_origin = false;
    if (req.body.img_delete === "1") {
      img_poems = null;
      delete_image_origin = true;
    } else {
      if (req.files && Object.keys(req.files).length > 0) {
        new_img_poems = req.files.new_img_poems;
        img_poems = (await uploader(new_img_poems.tempFilePath)).public_id;
        delete_image_origin = true;
      }
    }
    if (delete_image_origin && req.body.code_img_poems) {
      await destroy(req.body.code_img_poems);
    }
    if (img_poems = "null") {
      img_poems = "no_image";
    }
    var poem = {
      public_poems,
      name_poems: req.body.name_poems,
      poem_poems: req.body.poem_poems,
      img_poems,
    };
    var idTag = req.body.id_poems;
    await queryPoems.modifyByIdPoems(poem, idTag);
    res.redirect("/admin/jsPoems");
  } catch (error) {
    console.log("CATCH ERROR N°: ", error);
    res.render("admin/hbsPoemModify", {
      layout: "admin/hbsLayoutAdmin",
      welcomeUser: req.session.nameFromDB,
      error: true,
      poem: "We can't Modify the Data Message",
    });
  }
});
//! Poema Nuevo
/* (Etapa de Lectura) http://localhost:3000/admin/jsPoems/newPoem. */
router.get("/newPoem", (req, res, next) => {
  console.log("CONSOLE.LOG: setupAdmin.js File - GET /admin/jsPoems/newPoem");
  res.render("admin/hbsPoemNew", {
    layout: "admin/hbsLayoutAdmin", 
  });
});
// (Etapa de Escritura)  http://localhost:3000/admin/jsPoems/newPoem.
router.post("/newPoem", async (req, res, next) => {
  console.log("CONSOLE.LOG: setupAdmin.js File - POST /admin/jsPoems/newPoem");
  try {
    if (req.body.name_poems != "") {
      let check_public_poems = req.body.check_public_poems;
      if (check_public_poems) {
        public_poems = "Yes";
      } else {
        public_poems = "No";
      }
      let img_poems = req.body.img_poems;
      if (req.files && Object.keys(req.files).length > 0) {
        new_img_poems = req.files.new_img_poems;
        img_poems = (await uploader(new_img_poems.tempFilePath)).public_id;
      }
      var poem = {
        public_poems,
        name_poems: req.body.name_poems,
        poem_poems: req.body.poem_poems,
        img_poems,
      };
      await queryPoems.insertPoems(poem);
      res.redirect("/admin/jsPoems");
    } else {
      res.render("admin/hbsPoemNew", {
        layout: "admin/hbsLayoutAdmin", 
        welcomeUser: req.session.nameFromDB,
        error: true,
        message: "You need to complete all Tags before Save",
      });
    }
  } catch (error) {
    console.log("CATCH ERROR N°: ", error);
    res.render("admin/hbsPoemNew", {
      layout: "admin/hbsLayoutAdmin", 
      welcomeUser: req.session.nameFromDB,
      error: true,
      message: "We can't Save the new Poem",
    });
  }
});
//! Exportar
module.exports = router;
