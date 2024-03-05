import { promises as fs } from 'fs';
import { publicEncrypt, constants } from 'crypto';

const keysFilePath = './keys.json';

// If you have a specific type or interface for the publicKey, adjust the typing accordingly.
async function createAndEncryptMessage(
	uuid: string,
	publicKeyPem: string,
	message: string,
	sender_uuid: string,
	dateandtime: string
) {
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
		const encryptedMessage = publicEncrypt(
			{
				key: publicKeyPem,
				padding: constants.RSA_PKCS1_OAEP_PADDING,
				oaepHash: 'sha256',
			},
			// Ensure the message is a Buffer
			Buffer.from(messageStr)
		);

		// Create a filename based on the receiver's UUID
		const filename = `${uuid}_${new Date().toISOString()}.txt`.replace(
			/:/g,
			'-'
		);

		// Write the encrypted message to a file
		await fs.writeFile(filename, encryptedMessage);

		console.log(`Encrypted message saved to ${filename}`);
	} catch (error) {
		// Since 'error' is of type 'unknown', assert it to 'Error' to access 'message'
		console.error('An error occurred:', (error as Error).message);
	}
}

async function getMyUUID() {
	try {
		// Read the keys.json file
		const data = await fs.readFile(keysFilePath, { encoding: 'utf8' });
		// Parse the JSON data
		const keys = JSON.parse(data);
		// Access and return the UUID
		return keys.uuid;
	} catch (error) {
		console.error('An error occurred while reading keys.json:', error);
		return null; // Or throw the error, depending on how you want to handle this
	}
}

export { createAndEncryptMessage, getMyUUID };
