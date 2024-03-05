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
exports.decryptMessages = void 0;
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const keysFilePath = './keys.json';
function readKeys() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fs_1.promises.readFile(keysFilePath, { encoding: 'utf8' });
        const keys = JSON.parse(data);
        keys.uuid = keys.uuid.trim();
        return keys;
    });
}
function decryptFile(filePath, privateKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const encryptedData = yield fs_1.promises.readFile(filePath);
        console.log(`Encrypted data ${encryptedData}`);
        return (0, crypto_1.privateDecrypt)({
            key: privateKey,
            padding: crypto_1.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        }, encryptedData).toString('utf8');
    });
}
// Adjust decryptMessages to return an array of messages
function decryptMessages() {
    return __awaiter(this, void 0, void 0, function* () {
        let decryptedMessages = [];
        try {
            const { uuid, privateKey } = yield readKeys();
            const files = yield fs_1.promises.readdir('./'); // Adjust the directory as needed
            console.log('uuid:', uuid);
            console.log(`Files in directory:${files.join(', ')}`); // Add this before filtering
            const targetFiles = files.filter((file) => file.startsWith(`${uuid}_`) && file.endsWith('.txt'));
            console.log(`Target files: ${targetFiles}`);
            for (const file of targetFiles) {
                const decryptedMessage = yield decryptFile(`./${file}`, privateKey);
                decryptedMessages.push(decryptedMessage); // Collect decrypted messages
            }
            if (targetFiles.length === 0) {
                console.log('No messages to decrypt.');
            }
        }
        catch (error) {
            console.error('Error decrypting messages:', error);
            throw error; // It's better to throw the error to handle it in the Express route
        }
        return decryptedMessages;
    });
}
exports.decryptMessages = decryptMessages;
