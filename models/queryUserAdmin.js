// Declaración de Dependencias y Ficheros
var pool = require("./dataBase");
var md5 = require("md5");

async function getUserByUsernameAndPassword(userVarFunc, passVarFunc) {
  try {
    // Tener presente el nombre de la tabla y de los campos en la base de datos creada
    var actualQuery =
      "SELECT * FROM userAdmin WHERE nic_userAdmin = ? AND pass_userAdmin = ? limit 1";
    // limit 1 es la indicación para que detenga la búsqueda luego de la 1er coincidencia
    var rows = await pool.query(actualQuery, [userVarFunc, md5(passVarFunc)]);
    return rows[0];
    // Utilizamos rows[0] como refuerzo de "limit 1" Solo quiero una respuesta, No más.
  } catch (err) {
    console.log("CATCH ERROR N°: ", err);
    // En caso de error (ej no encuentra ) que me avise x consola y no se cuelgue.
  }
}
module.exports = { getUserByUsernameAndPassword };
