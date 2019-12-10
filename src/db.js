/*
Auditum Copyright (C) 2019  Nathan P. Bombana
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See t
he
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const mongoClient = require('mongodb').MongoClient;

/**
 * The available MongoDB collections
 *
 * @type {{DOCUMENTS: string}}
 */
const Collections = {
  DOCUMENTS: 'documents'
};


/* eslint-disable no-multi-spaces */
/**
 * Creates a MongoClient instance.
 *
 * @param {string} host   - The host of the connection. Default value is an environmental variable named "MONGO_HOST".
 * @param {string} port   - The port of the connection. Default value is an environmental variable named "MONGO_PORT".
 * @param {string} user   - The user to authenticate. Default value is an environmental variable named "MONGO_USER".
 * @param {string} pwd    - The password of the authentication. Default value is an environmental variable named "MONGO_PWD".
 * @param {string} authDb - The name of the database to authenticate. Default value is an environmental variable named "AUTH_DB".
 * @return {MongoClient}  - The [MongoClient] instance ready to connect.
 */
const createClient = (
    host   = process.env.MONGO_HOST,
    port   = process.env.MONGO_PORT,
    user   = process.env.MONGO_USER,
    pwd    = process.env.MONGO_PWD,
    authDb = process.env.AUTH_DB
) => mongoClient(`mongodb://${user}:${pwd}@${host}:${port}/${authDb}`);
/* eslint-enable no-multi-spaces */

module.exports = {
  createClient,
  Collections
};
