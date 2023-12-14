// Declaración de Dependencias y Ficheros
var pool = require("./dataBase");

// List All Public Users of Data Base
async function getAllUsersPublics() {
  try {
    var theQueryIs = "SELECT * FROM userspublics ORDER BY id_usersPublics asc";
    // limit 1 es la indicación para que detenga la búsqueda luego de la 1er coincidencia
    var resultOfQueryIs = await pool.query(theQueryIs);
    return resultOfQueryIs;
  } catch (err) {
    console.log("CATCH ERROR N°: ", err);
    // En caso de error (ej no encuentra ) que me avise x consola y no se cuelgue.
  }
}
// Insert a New Public User
async function insertByIdUsersPublics(obj) {
  try {
    var theQueryIs = "INSERT INTO userspublics SET ? ";
    var resultOfQueryIs = await pool.query(theQueryIs, [obj]);
    return resultOfQueryIs;
  } catch (error) {
    console.log("CATCH ERROR N°: ", error);
    throw error;
  }
}
// Delete a Public User by Id
async function deleteByIdUsersPublics(id) {
  var theQueryIs = "DELETE FROM userspublics WHERE id_usersPublics = ? ";
  var resultOfQueryIs = await pool.query(theQueryIs, [id]);
  return resultOfQueryIs;
}
// Get a Public User by Id
async function getByIdUsersPublics(id) {
  var theQueryIs = "SELECT * FROM userspublics WHERE id_usersPublics = ? ";
  var resultOfQueryIs = await pool.query(theQueryIs, [id]);
  return resultOfQueryIs[0];
}
// Modify Data from a Public User by Id
async function modifyByIdUsersPublics(obj, id) {
  try {
    var theQueryIs = "UPDATE userspublics SET ? WHERE id_usersPublics = ? ";
    var resultOfQueryIs = await pool.query(theQueryIs, [obj, id]);
    return resultOfQueryIs;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllUsersPublics,
  insertByIdUsersPublics,
  deleteByIdUsersPublics,
  getByIdUsersPublics,
  modifyByIdUsersPublics,
};
