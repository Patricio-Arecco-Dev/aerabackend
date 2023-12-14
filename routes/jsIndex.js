var express = require("express");
var router = express.Router();

//! Pagina de Inicio
/* Render de la pagina http://localhost:3000/. */
router.get("/", function (req, res, next) {
  console.log("CONSOLE.LOG: index.js File - GET /");
  res.render("hbsIndex", {
    layout: "hbsLayoutPublic",
  });
});

module.exports = router;
