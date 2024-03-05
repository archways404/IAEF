import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { generateKeyPairSync } from 'crypto';

const localUsersfilePath = './users.json';
const userMeta = './userMeta.json';

interface User {
	uuid: string;
	publicKey: string;
	nickname: string;
}

async function addUser(nickname: string): Promise<User | string> {
	try {
		// Attempt to read the metadata for UUID and publicKey
		const newUserMeta = await fs.readFile(userMeta, { encoding: 'utf8' });
		const { uuid, publicKey } = JSON.parse(newUserMeta);

		// Validate essential properties
		if (!(uuid && publicKey)) {
			throw new Error('Metadata is invalid.');
		}

		// Attempt to read existing users
		const usersData = await fs
			.readFile(localUsersfilePath, { encoding: 'utf8' })
			.catch((err) => {
				// Handle file not existing as a special case to proceed with empty users array
				if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
			});

		let users: User[] = usersData ? JSON.parse(usersData) : [];

		// Ensure no existing user has the same UUID or nickname
		if (
			users.some((user) => user.uuid === uuid || user.nickname === nickname)
		) {
			console.log('User or nickname exists already.');
			return 'User or nickname exists already';
		}

		// Construct the new user object with the provided nickname
		const newUser: User = { uuid, publicKey, nickname };
		users.push(newUser);

		// Write the updated user list back to the file
		await fs.writeFile(localUsersfilePath, JSON.stringify(users, null, 2));
		console.log('New user added.');
		return newUser;
	} catch (error) {
		console.error('An error occurred:', (error as Error).message);
		throw error;
	}
}

async function appendUserToFile(newUser: User): Promise<void> {
	let users: User[] = [];
	try {
		const usersData = await fs.readFile(localUsersfilePath, {
			encoding: 'utf8',
		});
		users = JSON.parse(usersData);
	} catch (err) {
		if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
			throw err;
		}
	}

	users.push(newUser);
	await fs.writeFile(localUsersfilePath, JSON.stringify(users, null, 2));
}

export { addUser };
