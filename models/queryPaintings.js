// Declaración de Dependencias y Ficheros
var pool = require("./dataBase");

// Insert a New Public Paintings
async function insertPaintings(obj) {
  try {
    var theQueryIs = "INSERT INTO paintings SET ? ";
    var resultOfQueryIs = await pool.query(theQueryIs, [obj]);
    return resultOfQueryIs;
  } catch (error) {
    console.log("CATCH ERROR N°: ", error);
    throw error;
  }
}
// Get All Paintings
async function getAllPaintings() {
  try {
    var theQueryIs = "SELECT * FROM paintings ORDER BY id_paintings asc";
    var resultOfQueryIs = await pool.query(theQueryIs);
    return resultOfQueryIs;
  } catch (err) {
    console.log("CATCH ERROR N°: ", err);
    // En caso de error (ej no encuentra ) que me avise x consola y no se cuelgue.
  }
}
// Get Public Paintings
async function getPublicPaintings() {
  try {
    var theQueryIs = "SELECT * FROM paintings WHERE public_paintings ='Yes' ORDER BY id_paintings asc";
    var resultOfQueryIs = await pool.query(theQueryIs);
    return resultOfQueryIs;
  } catch (err) {
    console.log("CATCH ERROR N°: ", err);
    // En caso de error (ej no encuentra ) que me avise x consola y no se cuelgue.
  }
}

// Get a Paintings User by Id
async function getByIdPaintings(id) {
  var theQueryIs = "SELECT * FROM paintings WHERE id_paintings = ? ";
  var resultOfQueryIs = await pool.query(theQueryIs, [id]);
  return resultOfQueryIs[0];
}
// Modify a Paintings User by Id
async function modifyByIdPaintings(obj, id) {
  try {
    var theQueryIs = "UPDATE paintings SET ? WHERE id_paintings = ? ";
    var resultOfQueryIs = await pool.query(theQueryIs, [obj, id]);
    return resultOfQueryIs;
  } catch (error) {
    throw error;
  }
}
// Delete a Paintings by Id
async function deleteByIdPaintings(id) {
  var theQueryIs = "DELETE FROM paintings WHERE id_paintings = ? ";
  var resultOfQueryIs = await pool.query(theQueryIs, [id]);
  return resultOfQueryIs;
}


module.exports = {
  insertPaintings,
  getAllPaintings,
  getPublicPaintings,
  getByIdPaintings,
  modifyByIdPaintings,
  deleteByIdPaintings,
};