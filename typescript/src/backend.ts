import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { checkOrCreateKeys } from './func/keysManager';
import { addUser } from './func/addUser';
import { findUserByNickname } from './func/findUser';
import { createAndEncryptMessage, getMyUUID } from './func/encryptMessage';
import { decryptMessages } from './func/decryptMessage';
import { createUserMeta } from './func/createMeta';

app.get('/ping', (req, res) => {
	res.json({ message: 'pong' });
});

app.get('/keys', (req, res) => {
	checkOrCreateKeys()
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

app.post('/add', async (req, res) => {
	try {
		const { nickname } = req.body;
		const result = await addUser(nickname);
		if (typeof result === 'string' && result === 'User exists already') {
			// User exists, so maybe return a 409 Conflict status code or similar
			return res.status(409).json({ message: result });
		}
		// Successfully added a new user
		return res.status(201).json({
			message: 'New user added successfully',
			user: result,
		});
	} catch (error) {
		// Internal server error
		return res.status(500).json({
			message: 'An error occurred',
			error: (error as Error).message,
		});
	}
});

app.post('/search', async (req, res) => {
	try {
		// Extract nickname from the request body
		const { nickname } = req.body;

		// Use the findUserByNickname function to search for the user
		const user = await findUserByNickname(nickname);

		// Check if a user was found
		if (user) {
			// User found, return the user data
			return res.status(200).json({
				message: 'User found',
				user,
			});
		} else {
			// No user found with the provided nickname
			return res.status(404).json({
				message: 'User not found',
			});
		}
	} catch (error) {
		// Handle errors, such as issues reading the file
		// Use type assertion to treat error as an instance of Error
		const err = error as Error;
		console.error('Search error:', err.message);
		return res.status(500).json({
			message: 'An error occurred during the search',
			error: err.message,
		});
	}
});

app.post('/createMessage', async (req, res) => {
	try {
		// Extract nickname from the request body
		const { nickname, message } = req.body;

		// Use the findUserByNickname function to search for the user
		const user = await findUserByNickname(nickname);

		// Check if a user was found
		if (user) {
			// User found, return the user data
			const uuid = user.uuid;
			const publicKey = user.publicKey;
			const sender_uuid = await getMyUUID();
			const dateandtime = new Date().toISOString();

			console.log('uuid', uuid);
			console.log('publicKey', publicKey);
			console.log('sender_uuid', sender_uuid);
			console.log('dateandtime', dateandtime);

			await createAndEncryptMessage(
				uuid,
				publicKey,
				message,
				sender_uuid,
				dateandtime
			);
			return res.status(200).json({
				message: 'Message created and encrypted successfully',
			});
		} else {
			// No user found with the provided nickname
			return res.status(404).json({
				message: 'User not found',
			});
		}
	} catch (error) {
		// Handle errors, such as issues reading the file
		// Use type assertion to treat error as an instance of Error
		const err = error as Error;
		console.error('Search error:', err.message);
		return res.status(500).json({
			message: 'An error occurred during the search',
			error: err.message,
		});
	}
});

app.get('/readMessages', async (req, res) => {
	try {
		const messages = await decryptMessages();
		res.json({ messages });
	} catch (error) {
		const err = error as Error;
		res
			.status(500)
			.json({ message: 'Failed to decrypt messages', error: err.message });
	}
});

app.get('/shareInfo', async (req, res) => {
	await createUserMeta();
});

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
