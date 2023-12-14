// Declaración de Dependencias
var express = require("express");
var router = express.Router();
var md5 = require("md5");
// Dependencias para trabajar con imágenes
var util = require("util");
//var cloudinary = require("cloudinary").v2;
//const uploader = util.promisify(cloudinary.uploader.upload);
//const destroy = util.promisify(cloudinary.uploader.destroy);
//Declaración de los ficheros requeridos
var queryUsersPublics = require("./../../models/queryUsersPublics");

//! Incorporar Usuario
// (Etapa de Lectura) http://localhost:3000/admin/jsUsers/newUser. */
router.get("/", (req, res, next) => {
  console.log("CONSOLE.LOG: setupAdmin.js File - GET /admin/jsUsers/newUser");
  res.render("admin/hbsUserNew", {
    layout: "admin/hbsLayoutAdmin",
    welcomeUser: req.session.nameFromDB,
  });
});
// (Etapa de Escritura) http://localhost:3000/admin/jsUsers/newUser -
router.post("/newUser", async (req, res, next) => {
  console.log("CONSOLE.LOG: setupAdmin.js File - POST /admin/jsUsers/newUser");
  try {
    if (
      req.body.nic_usersPublics != "" &&
      req.body.pass_usersPublics != "" &&
      req.body.name_usersPublics != "" &&
      req.body.surn_usersPublics != "" &&
      req.body.age_usersPublics != "" &&
      req.body.email_usersPublics != ""
    ) {
      req.body.pass_usersPublics = md5(req.body.pass_usersPublics);
      await queryUsersPublics.insertByIdUsersPublics(req.body);
      res.redirect("/admin/jsAdminSetup");
    } else {
      console.log("else");
      res.render("admin/hbsUserNew", {
        layout: "admin/hbsLayoutAdmin",
        welcomeUser: req.session.nameFromDB,
        error: true,
        message: "You need to complete all Tags before Save",
      });
    }
  } catch (error) {
    console.log("CATCH ERROR N°: ", error);
    res.render("admin/hbsUserNew", {
      layout: "admin/hbsLayoutAdmin",
      error: true,
      message: "We can't Save the new User",
    });
  }
});
//! Eliminar Usuario
// (Etapa de Escritura) http://localhost:3000/admin/jsUsers
router.get("/deleteUser/:id_usersPublics", async (req, res, next) => {
  console.log("CONSOLE.LOG: setupAdmin.js File - GET /admin/jsUsers/deleteUser");
  var idTag = req.params.id_usersPublics;
  await queryUsersPublics.deleteByIdUsersPublics(idTag);
  res.redirect("/admin/jsAdminSetup");
});

//! Modificar Datos de Usuario
// (Etapa de Lectura) http://localhost:3000/admin/jsUsers.
router.get("/modifyUser/:id_usersPublics", async (req, res, next) => {
  console.log("CONSOLE.LOG: setupAdmin.js File - GET /admin/jsUsers/modifyUser");
  var idTag = req.params.id_usersPublics;
  var userPublic = await queryUsersPublics.getByIdUsersPublics(idTag);
  res.render("admin/hbsUserModify", {
    layout: "admin/hbsLayoutAdmin",
    userPublic,
    welcomeUser: req.session.nameFromDB,
  });
});

// (Etapa de Escritura) http://localhost:3000/admin/jsUsers.
router.post("/modifyUser", async (req, res, next) => {
  console.log("CONSOLE.LOG: setupAdmin.js File - POST /admin/jsUsers/modifyUser");
  try {
    var userPublic = {
      nic_usersPublics: req.body.nic_usersPublics,
      pass_usersPublics: md5(req.body.pass_usersPublics),
      name_usersPublics: req.body.name_usersPublics,
      surn_usersPublics: req.body.surn_usersPublics,
      age_usersPublics: req.body.age_usersPublics,
      email_usersPublics: req.body.email_usersPublics,
    };
    await queryUsersPublics.modifyByIdUsersPublics(
      userPublic,
      req.body.id_usersPublics
    );
    res.redirect("/admin/jsAdminSetup");
  } catch (error) {
    console.log("CATCH ERROR N°: ", error);
    res.render("admin/hbsUserModify", {
      layout: "admin/hbsLayoutAdmin",
      welcomeUser: req.session.nameFromDB,
      error: true,
      message: "We can't Modify the Data User",
    });
  }
});
//! Exportar
module.exports = router;
