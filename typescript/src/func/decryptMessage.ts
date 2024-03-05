import { promises as fs } from 'fs';
import { privateDecrypt, constants } from 'crypto';
import * as path from 'path';

interface Keys {
	uuid: string;
	privateKey: string;
}

const keysFilePath = './keys.json';

async function readKeys(): Promise<Keys> {
	const data = await fs.readFile(keysFilePath, { encoding: 'utf8' });
	const keys: Keys = JSON.parse(data);
	keys.uuid = keys.uuid.trim();
	return keys;
}

async function decryptFile(
	filePath: string,
	privateKey: string
): Promise<string> {
	const encryptedData = await fs.readFile(filePath);
	console.log(`Encrypted data ${encryptedData}`);
	return privateDecrypt(
		{
			key: privateKey,
			padding: constants.RSA_PKCS1_OAEP_PADDING,
			oaepHash: 'sha256',
		},
		encryptedData
	).toString('utf8');
}

async function decryptMessages(): Promise<string[]> {
	let decryptedMessages: string[] = [];
	try {
		const { uuid, privateKey } = await readKeys();
		const files = await fs.readdir('./');
		console.log('uuid:', uuid);
		console.log(`Files in directory:${files.join(', ')}`);
		const targetFiles = files.filter(
			(file) => file.startsWith(`${uuid}_`) && file.endsWith('.txt')
		);

		console.log(`Target files: ${targetFiles}`);

		for (const file of targetFiles) {
			const decryptedMessage = await decryptFile(`./${file}`, privateKey);
			decryptedMessages.push(decryptedMessage);
		}

		if (targetFiles.length === 0) {
			console.log('No messages to decrypt.');
		}
	} catch (error) {
		console.error('Error decrypting messages:', error);
		throw error;
	}

	return decryptedMessages;
}

export { decryptMessages };
