// Declaración de las librerías que al momento tiene capacidad de invocar.
var createError = require("http-errors");
var express = require("express");
//var app = express();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// Dependencia dotenv. Debe esta por encima de la linea de Variables de ruta
require("dotenv").config();
// Variable de sesión para autorizaciones
var session = require("express-session");
// Variable de uso para Subir las imágenes al Cloudinary con express-fileupload
var fileUpload = require("express-fileupload");
// Variable para la creación de la API
var cors = require('cors');
// Asigno cada fichero .js dentro de routes a una variable.
var indexRouter = require("./routes/jsIndex");
var messengerRouter = require("./routes/jsMessenger");
var publicationsRouter = require("./routes/jsPublications");
var loginPRouter = require("./routes/jsLogin");
var adminRouter = require("./routes/admin/jsAdminSetup");
var usersRouter = require("./routes/admin/jsUsers");
var poemsRouter = require("./routes/admin/jsPoems");
var paintingsRouter = require("./routes/admin/jsPaintings");
var setpublicationsRouter = require("./routes/admin/jsPublicationsSetup");

var apiRouter = require("./routes/api");

// Declaración de Express
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public/css"));
app.use(express.static("public/icons"));

// Variables de sesión
app.use(
  session({
    secret: "a23P578W21e41",
    resave: false,
    saveUninitialized: true,
  })
);
// Variable del fileUpload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
// Middleware express
secured = async (req, res, next) => {
  try {
    if (req.session.idFromDB) {
      // is_usuario esta definido en login.js
      next();
    } else {
      res.redirect("/jsLogin"); ///admin/jsLogin
    } // cierro el else
  } catch (error) {
    console.log("CATCH ERROR N°: ", error);
  } // cierro el catch
}; // cierro el secured
// Indico que: cuando escribo una ruta en la linea del comando del navegador
// llame a la variable indicada.
// Ej.: localhost:3000/ => localhost:3000/jsIndex.js
app.use("/", indexRouter);
app.use("/jsIndex", indexRouter); //! Opcional
app.use("/jsMessenger", messengerRouter);
app.use("/jsPublications", publicationsRouter);
app.use("/jsLogin", loginPRouter);
app.use("/admin/jsAdminSetup", secured, adminRouter);
app.use("/admin/jsUsers", secured, usersRouter);
app.use("/admin/jsPoems", secured, poemsRouter);
app.use("/admin/jsPaintings", secured, paintingsRouter);
app.use("/admin/jsPublicationsSetup", secured, setpublicationsRouter);
app.use("/api",cors(), apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("hbsError");
});

module.exports = app;
