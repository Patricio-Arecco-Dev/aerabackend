// Declaración de Dependencias y Ficheros
var pool = require("./dataBase");

// Insert a New Public Poems
async function insertPoems(obj) {
  try {
    var theQueryIs = "INSERT INTO poems SET ? ";
    var resultOfQueryIs = await pool.query(theQueryIs, [obj]);
    return resultOfQueryIs;
  } catch (error) {
    console.log("CATCH ERROR N°: ", error);
    throw error;
  }
}
// Get All Poems
async function getAllPoems() {
  try {
    var theQueryIs = "SELECT * FROM poems ORDER BY id_poems asc";
    var resultOfQueryIs = await pool.query(theQueryIs);
    return resultOfQueryIs;
  } catch (err) {
    console.log("CATCH ERROR N°: ", err);
    // En caso de error (ej no encuentra ) que me avise x consola y no se cuelgue.
  }
}
// Get Public Poems
async function getPublicPoems() {
  try {
    var theQueryIs =
      "SELECT * FROM poems WHERE public_poems ='Yes' ORDER BY id_poems asc";
    var resultOfQueryIs = await pool.query(theQueryIs);
    return resultOfQueryIs;
  } catch (err) {
    console.log("CATCH ERROR N°: ", err);
    // En caso de error (ej no encuentra ) que me avise x consola y no se cuelgue.
  }
}

// Get a Poems User by Id
async function getByIdPoems(id) {
  var theQueryIs = "SELECT * FROM poems WHERE id_poems = ? ";
  var resultOfQueryIs = await pool.query(theQueryIs, [id]);
  return resultOfQueryIs[0];
}
// Modify a Poems User by Id
async function modifyByIdPoems(obj, id) {
  try {
    var theQueryIs = "UPDATE poems SET ? WHERE id_poems = ? ";
    var resultOfQueryIs = await pool.query(theQueryIs, [obj, id]);
    return resultOfQueryIs;
  } catch (error) {
    throw error;
  }
}
// Delete a Poems by Id
async function deleteByIdPoems(id) {
  var theQueryIs = "DELETE FROM poems WHERE id_poems = ? ";
  var resultOfQueryIs = await pool.query(theQueryIs, [id]);
  return resultOfQueryIs;
}

module.exports = {
  insertPoems,
  getAllPoems,
  getPublicPoems,
  getByIdPoems,
  modifyByIdPoems,
  deleteByIdPoems,
};
