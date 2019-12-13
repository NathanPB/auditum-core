/*
Rust Toolbox Copyright (C) 2019  Nathan P. Bombana, Lucas Vicari
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/**
 * @typedef {function} CommandArgsValidator
 *
 * Function used to check if a command will receive the valid argumentation.
 *
 * @param {String[]} args - The argumentation to check if is valid.
 * @throws {Error} - If the arguments passed are not valid.
 */

/**
 * @typedef {function} CommandRunnable
 *
 * Function used to actually run a command.
 *
 * @param {String[]} args - The argumentation passed to the command function.
 */

/**
 * @typedef {Object} CommandObject
 * @type {{ runnable: CommandRunnable, checkArgs: CommandArgsValidator }}
 */

module.exports = {
  search: require('./commands/search')
};
