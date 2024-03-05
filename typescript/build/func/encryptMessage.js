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
exports.getMyUUID = exports.createAndEncryptMessage = void 0;
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const keysFilePath = './keys.json';
// If you have a specific type or interface for the publicKey, adjust the typing accordingly.
function createAndEncryptMessage(uuid, publicKeyPem, message, sender_uuid, dateandtime) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Define the message format
            const messageObj = {
                message,
                sender_uuid,
                dateandtime,
            };
            // Convert the message object to a string
            const messageStr = JSON.stringify(messageObj);
            // Encrypt the message with the receiver's public key
            const encryptedMessage = (0, crypto_1.publicEncrypt)({
                key: publicKeyPem,
                padding: crypto_1.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            }, 
            // Ensure the message is a Buffer
            Buffer.from(messageStr));
            // Create a filename based on the receiver's UUID
            const filename = `${uuid}_${new Date().toISOString()}.txt`.replace(/:/g, '-');
            // Write the encrypted message to a file
            yield fs_1.promises.writeFile(filename, encryptedMessage);
            console.log(`Encrypted message saved to ${filename}`);
        }
        catch (error) {
            // Since 'error' is of type 'unknown', assert it to 'Error' to access 'message'
            console.error('An error occurred:', error.message);
        }
    });
}
exports.createAndEncryptMessage = createAndEncryptMessage;
function getMyUUID() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Read the keys.json file
            const data = yield fs_1.promises.readFile(keysFilePath, { encoding: 'utf8' });
            // Parse the JSON data
            const keys = JSON.parse(data);
            // Access and return the UUID
            return keys.uuid;
        }
        catch (error) {
            console.error('An error occurred while reading keys.json:', error);
            return null; // Or throw the error, depending on how you want to handle this
        }
    });
}
exports.getMyUUID = getMyUUID;
