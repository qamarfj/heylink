// db setup
const dbOptions = require("../knexfile");
import { knex } from "knex";
// create connection
const knexcon = knex(dbOptions);
console.log(` connection to ${dbOptions.connection.database} db successful!`);

module.exports = knexcon;
