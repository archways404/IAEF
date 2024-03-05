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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const keysManager_1 = require("./func/keysManager");
const addUser_1 = require("./func/addUser");
const findUser_1 = require("./func/findUser");
const encryptMessage_1 = require("./func/encryptMessage");
const decryptMessage_1 = require("./func/decryptMessage");
app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});
app.get('/keys', (req, res) => {
    (0, keysManager_1.checkOrCreateKeys)()
        .then((data) => {
        console.log(data);
        res.json({
            message: 'Success',
            uuid: data.uuid,
            publicKey: data.publicKey,
            privateKey: data.privateKey,
        });
    })
        .catch((error) => {
        console.error('An error occurred:', error);
        res
            .status(500)
            .json({ message: 'An error occurred', error: error.message });
    });
});
app.post('/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nickname } = req.body;
        const result = yield (0, addUser_1.addUser)(nickname);
        if (typeof result === 'string' && result === 'User exists already') {
            // User exists, so maybe return a 409 Conflict status code or similar
            return res.status(409).json({ message: result });
        }
        // Successfully added a new user
        return res.status(201).json({
            message: 'New user added successfully',
            user: result,
        });
    }
    catch (error) {
        // Internal server error
        return res.status(500).json({
            message: 'An error occurred',
            error: error.message,
        });
    }
}));
app.post('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract nickname from the request body
        const { nickname } = req.body;
        // Use the findUserByNickname function to search for the user
        const user = yield (0, findUser_1.findUserByNickname)(nickname);
        // Check if a user was found
        if (user) {
            // User found, return the user data
            return res.status(200).json({
                message: 'User found',
                user,
            });
        }
        else {
            // No user found with the provided nickname
            return res.status(404).json({
                message: 'User not found',
            });
        }
    }
    catch (error) {
        // Handle errors, such as issues reading the file
        // Use type assertion to treat error as an instance of Error
        const err = error;
        console.error('Search error:', err.message);
        return res.status(500).json({
            message: 'An error occurred during the search',
            error: err.message,
        });
    }
}));
app.post('/createMessage', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract nickname from the request body
        const { nickname, message } = req.body;
        // Use the findUserByNickname function to search for the user
        const user = yield (0, findUser_1.findUserByNickname)(nickname);
        // Check if a user was found
        if (user) {
            // User found, return the user data
            const uuid = user.uuid;
            const publicKey = user.publicKey;
            const sender_uuid = yield (0, encryptMessage_1.getMyUUID)();
            const dateandtime = new Date().toISOString();
            console.log('uuid', uuid);
            console.log('publicKey', publicKey);
            console.log('sender_uuid', sender_uuid);
            console.log('dateandtime', dateandtime);
            yield (0, encryptMessage_1.createAndEncryptMessage)(uuid, publicKey, message, sender_uuid, dateandtime);
            return res.status(200).json({
                message: 'Message created and encrypted successfully',
            });
        }
        else {
            // No user found with the provided nickname
            return res.status(404).json({
                message: 'User not found',
            });
        }
    }
    catch (error) {
        // Handle errors, such as issues reading the file
        // Use type assertion to treat error as an instance of Error
        const err = error;
        console.error('Search error:', err.message);
        return res.status(500).json({
            message: 'An error occurred during the search',
            error: err.message,
        });
    }
}));
app.get('/readMessages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield (0, decryptMessage_1.decryptMessages)();
        res.json({ messages });
    }
    catch (error) {
        const err = error;
        res
            .status(500)
            .json({ message: 'Failed to decrypt messages', error: err.message });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
