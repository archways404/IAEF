import { promises as fs } from 'fs';

interface Keys {
	uuid: string;
	privateKey: string;
	publicKey: string;
}

const keysFilePath = './keys.json';
const userMetaFilePath = './share/userMeta.json';

async function createUserMeta(): Promise<void> {
	try {
		// Step 1: Read keys.json
		const data = await fs.readFile(keysFilePath, { encoding: 'utf8' });
		const { uuid, publicKey }: Keys = JSON.parse(data);

		// Verify that we have the necessary data
		if (!uuid || !publicKey) {
			console.error('UUID or publicKey is missing from keys.json');
			return;
		}

		// Step 2: Create userMeta.json with the UUID and publicKey
		const userMeta = { uuid, publicKey };
		await fs.writeFile(userMetaFilePath, JSON.stringify(userMeta, null, 2)); // Pretty print JSON

		console.log('userMeta.json has been created successfully.');
	} catch (error) {
		console.error('Error creating userMeta.json:', error);
	}
}

export { createUserMeta };
