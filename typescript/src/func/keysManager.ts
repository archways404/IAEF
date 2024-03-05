import { promises as fs } from 'fs';
import { generateKeyPairSync } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const filePath = './keys.json';

async function checkOrCreateKeys() {
	try {
		// Check if the file exists
		const data = await fs.readFile(filePath, { encoding: 'utf8' });
		const { uuid, publicKey, privateKey } = JSON.parse(data);

		// Validate the file content
		if (uuid && publicKey && privateKey) {
			console.log('UUID and keys already exist.');
			return { uuid, publicKey, privateKey };
		} else {
			throw new Error('File exists but content is invalid.');
		}
	} catch (error) {
		// If the file does not exist or content is invalid, create new UUID and keys
		console.log('Creating new UUID and keys...');
		const newUuid = uuidv4();
		const { publicKey, privateKey } = generateKeyPairSync('rsa', {
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
		await fs.writeFile(
			filePath,
			JSON.stringify({ uuid: newUuid, publicKey, privateKey })
		);
		console.log('New UUID and keys have been saved.');
		return { uuid: newUuid, publicKey, privateKey };
	}
}

export { checkOrCreateKeys };
