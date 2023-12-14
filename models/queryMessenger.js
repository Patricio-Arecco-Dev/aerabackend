// Declaración de Dependencias y Ficheros
var pool = require("./dataBase");

// Insert a New Public Message
async function insertMessenger(obj) {
  try {
    var theQueryIs = "INSERT INTO receivedmessages SET ? ";
    var resultOfQueryIs = await pool.query(theQueryIs, [obj]);
    return resultOfQueryIs;
  } catch (error) {
    console.log("CATCH ERROR N°: ", error);
    throw error;
  }
}
// Get All Messages
async function getAllMessages() {
  try {
    var theQueryIs = "SELECT * FROM receivedmessages ORDER BY id_messenger asc";
    var resultOfQueryIs = await pool.query(theQueryIs);
    return resultOfQueryIs;
  } catch (err) {
    console.log("CATCH ERROR N°: ", err);
    // En caso de error (ej no encuentra ) que me avise x consola y no se cuelgue.
  }
}
// Get All Public Messages
async function getPublicMessages() {
  try {
    var theQueryIs = "SELECT * FROM receivedmessages WHERE public_messenger = 'Yes' ORDER BY id_messenger asc";
    var resultOfQueryIs = await pool.query(theQueryIs);
    return resultOfQueryIs;
  } catch (err) {
    console.log("CATCH ERROR N°: ", err);
    // En caso de error (ej no encuentra ) que me avise x consola y no se cuelgue.
  }
}
// Get a Message User by Id
async function getByIdMessages(id) {
  var theQueryIs = "SELECT * FROM receivedmessages WHERE id_messenger = ? ";
  var resultOfQueryIs = await pool.query(theQueryIs, [id]);
  return resultOfQueryIs[0];
}
// Modify a Message User by Id
async function modifyByIdMessages(obj, id) {
  try {
    var theQueryIs = "UPDATE receivedmessages SET ? WHERE id_messenger = ? ";
    var resultOfQueryIs = await pool.query(theQueryIs, [obj, id]);
    return resultOfQueryIs;
  } catch (error) {
    throw error;
  }
}
// Delete a Public User by Id
async function deleteByIdMessages(id) {
  var theQueryIs = "DELETE FROM receivedmessages WHERE id_messenger = ? ";
  var resultOfQueryIs = await pool.query(theQueryIs, [id]);
  return resultOfQueryIs;
}


module.exports = {
  insertMessenger,
  getAllMessages,
  getPublicMessages,
  getByIdMessages,
  modifyByIdMessages,
  deleteByIdMessages,
};
