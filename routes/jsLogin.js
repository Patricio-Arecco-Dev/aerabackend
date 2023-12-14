// Declaración de Dependencias
var express = require("express");
var router = express.Router();
//Declaración de los ficheros requeridos
var queryUserAdmin = require("./../models/queryUserAdmin");

//! Inicio de session de Administrados
/* (Etapa de Lectura) http://localhost:3000/jsLogin. */
router.get("/", function (req, res, next) {
  console.log("CONSOLE.LOG: login.js File - GET /");
  res.render("hbsLogin", {
    layout: "hbsLayoutPublic",
  });
});
/* (Etapa de Escritura) http://localhost:3000/jsLogin. */
router.post("/", async (req, res, next) => {
  console.log("CONSOLE.LOG: login.js File - POST /");
  try {
    var userVarLogin = req.body.nameUserHbs; // Captura el input Usuario de login.hbs
    var passVarLogin = req.body.namePassHbs; // Captura el input Clave de login.hbs
    // Los valores capturados los pasamos a la función encargada de buscar en la Base
    // de Datos y el resultado se guarda en "data"
    var data = await queryUserAdmin.getUserByUsernameAndPassword(
      userVarLogin,
      passVarLogin
    );
    if (data != undefined) {
      // Guardamos las variables de session
      // idFromDB lo usaremos en app.js
      req.session.idFromDB = data.id_userAdmin; // data.nombre_de_la_columna (1) en la Base de datos
      req.session.nameFromDB = data.nic_userAdmin; // data.nombre_de_la_columna (2) en la Base de datos
      // Si el usuario & password son correctos carga la pagina /setupAdmin
      res.redirect("/admin/jsAdminSetup");
    } else {
      // Si el usuario & password No son correctos vuelve a cargar la pagina /jsLogin e indica el error
      res.render("hbsLogin", {
        layout: "hbsLayoutPublic",
        error: true,
      });
    }
  } catch (error) {
    console.log("CATCH ERROR N°: ", error);
  }
});

//! Cierre de session de Administrados
/* (Etapa de Lectura) http://localhost:3000/jsLogin. */
router.get("/logout", function (req, res, next) {
  console.log("CONSOLE.LOG: login.js File - GET /logout");
  req.session.destroy(); // Destruir la sesión
  res.render("hbsLogin", {
    layout: "hbsLayoutPublic", 
  });
});
module.exports = router;
