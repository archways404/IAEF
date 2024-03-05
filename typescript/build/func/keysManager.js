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
exports.checkOrCreateKeys = void 0;
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const uuid_1 = require("uuid");
const filePath = './keys.json';
function checkOrCreateKeys() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Check if the file exists
            const data = yield fs_1.promises.readFile(filePath, { encoding: 'utf8' });
            const { uuid, publicKey, privateKey } = JSON.parse(data);
            // Validate the file content
            if (uuid && publicKey && privateKey) {
                console.log('UUID and keys already exist.');
                return { uuid, publicKey, privateKey };
            }
            else {
                throw new Error('File exists but content is invalid.');
            }
        }
        catch (error) {
            // If the file does not exist or content is invalid, create new UUID and keys
            console.log('Creating new UUID and keys...');
            const newUuid = (0, uuid_1.v4)();
            const { publicKey, privateKey } = (0, crypto_1.generateKeyPairSync)('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                },
            });
            // Save them to the file
            yield fs_1.promises.writeFile(filePath, JSON.stringify({ uuid: newUuid, publicKey, privateKey }));
            console.log('New UUID and keys have been saved.');
            return { uuid: newUuid, publicKey, privateKey };
        }
    });
}
exports.checkOrCreateKeys = checkOrCreateKeys;
