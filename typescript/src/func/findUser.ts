import { promises as fs } from 'fs';

const localUsersfilePath = './users.json';

// Assuming the User interface is defined elsewhere if needed
interface User {
	uuid: string;
	publicKey: string;
	nickname: string;
}

async function findUserByNickname(nickname: string): Promise<User | null> {
	try {
		const usersData = await fs.readFile(localUsersfilePath, {
			encoding: 'utf8',
		});
		const users: User[] = JSON.parse(usersData);

		// Find user by nickname
		const user = users.find((user) => user.nickname === nickname);

		// If a user is found, return the user object; otherwise, return null
		return user || null;
	} catch (error) {
		console.error(
			'An error occurred in findUserByNickname:',
			(error as Error).message
		);
		// Consider whether you want to throw the error or return null in case of a file read error
		// Throwing the error would allow the calling function to handle it (e.g., to return an HTTP 500 response)
		throw error; // or return null if you prefer to silently handle the error
	}
}

export { findUserByNickname };
