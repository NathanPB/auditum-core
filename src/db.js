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

const MongoClient = require('mongodb').MongoClient;

/**
 * The available MongoDB collections
 *
 * @type {{DOCUMENTS: string}}
 */
const Collections = {
  DOCUMENTS: 'documents'
};

/**
 * Creates a MongoClient instance.
 *
 * @param host   {string} - The host of the connection. Default value is an environmental variable named "MONGO_HOST".
 * @param port   {string} - The port of the connection. Default value is an environmental variable named "MONGO_PORT".
 * @param user   {string} - The user to authenticate. Default value is an environmental variable named "MONGO_USER".
 * @param pwd    {string} - The password of the authentication. Default value is an environmental variable named "MONGO_PWD".
 * @param authDb {string} - The name of the database to authenticate. Default value is an environmental variable named "AUTH_DB".
 * @returns {MongoClient} - The [MongoClient] instance ready to connect.
 */
const createClient = (
    host   = process.env.MONGO_HOST,
    port   = process.env.MONGO_PORT,
    user   = process.env.MONGO_USER,
    pwd    = process.env.MONGO_PWD,
    authDb = process.env.AUTH_DB
) => MongoClient(`mongodb://${user}:${pwd}@${host}:${port}/${authDb}`);

module.exports = {
    createClient,
    Collections
};
