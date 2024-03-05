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
exports.findUserByNickname = void 0;
const fs_1 = require("fs");
const localUsersfilePath = './users.json';
function findUserByNickname(nickname) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const usersData = yield fs_1.promises.readFile(localUsersfilePath, {
                encoding: 'utf8',
            });
            const users = JSON.parse(usersData);
            // Find user by nickname
            const user = users.find((user) => user.nickname === nickname);
            // If a user is found, return the user object; otherwise, return null
            return user || null;
        }
        catch (error) {
            console.error('An error occurred in findUserByNickname:', error.message);
            // Consider whether you want to throw the error or return null in case of a file read error
            // Throwing the error would allow the calling function to handle it (e.g., to return an HTTP 500 response)
            throw error; // or return null if you prefer to silently handle the error
        }
    });
}
exports.findUserByNickname = findUserByNickname;
