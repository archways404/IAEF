"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = void 0;
const fs_1 = require("fs");
const localUsersfilePath = './users.json';
const userMeta = './userMeta.json';
function addUser(nickname) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Attempt to read the metadata for UUID and publicKey
            const newUserMeta = yield fs_1.promises.readFile(userMeta, { encoding: 'utf8' });
            const { uuid, publicKey } = JSON.parse(newUserMeta);
            // Validate essential properties
            if (!(uuid && publicKey)) {
                throw new Error('Metadata is invalid.');
            }
            // Attempt to read existing users
            const usersData = yield fs_1.promises
                .readFile(localUsersfilePath, { encoding: 'utf8' })
                .catch((err) => {
                // Handle file not existing as a special case to proceed with empty users array
                if (err.code !== 'ENOENT')
                    throw err;
            });
            let users = usersData ? JSON.parse(usersData) : [];
            // Ensure no existing user has the same UUID or nickname
            if (users.some((user) => user.uuid === uuid || user.nickname === nickname)) {
                console.log('User or nickname exists already.');
                return 'User or nickname exists already';
            }
            // Construct the new user object with the provided nickname
            const newUser = { uuid, publicKey, nickname };
            users.push(newUser);
            // Write the updated user list back to the file
            yield fs_1.promises.writeFile(localUsersfilePath, JSON.stringify(users, null, 2));
            console.log('New user added.');
            return newUser;
        }
        catch (error) {
            console.error('An error occurred:', error.message);
            throw error;
        }
    });
}
exports.addUser = addUser;
function appendUserToFile(newUser) {
    return __awaiter(this, void 0, void 0, function* () {
        let users = [];
        try {
            const usersData = yield fs_1.promises.readFile(localUsersfilePath, {
                encoding: 'utf8',
            });
            users = JSON.parse(usersData);
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            }
        }
        users.push(newUser);
        yield fs_1.promises.writeFile(localUsersfilePath, JSON.stringify(users, null, 2));
    });
}
