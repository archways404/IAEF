
# IAEF - If All Else Fails

IAEF, "IF All Else Fails" is a robust messaging application designed to ensure communication continuity in scenarios where traditional infrastructure such as the internet and cellular networks are unavailable. By leveraging device-to-device proximity technologies, our application facilitates the secure and encrypted exchange of messages, ensuring that vital communications can persist even in the most challenging conditions.

## Features
- **Encrypted Messaging**: Ensures that messages are securely encrypted, readable only by the intended recipient.
- **Proximity-Based Discovery**: Automatically searches for nearby devices to relay messages, creating a mesh network of connected users.
- **Resilience**: Operates independently of traditional infrastructure, making it ideal for use in emergencies, remote locations, or any situation where standard communication channels are compromised.
- **User Anonymity**: Prioritizes user privacy by using UUIDs for identification, without revealing any personal information.
- **Cross-Platform Compatibility**: Designed to work across various devices, enhancing accessibility and user reach.

## How It Works
1. **Message Creation**: Users write a message intended for a specific recipient, identified by their UUID.
2. **Encryption**: Messages are encrypted using the recipient's public key, ensuring that only the recipient can decrypt and read the message.
3. **Proximity Relay**: The application searches for nearby devices using Bluetooth or any available proximity technology, relaying the encrypted message.
4. **Recipient Decryption**: Upon reaching the intended recipient, the message is decrypted using the recipient's private key, making the information accessible only to them.

## How to Contribute
We welcome contributions from the community! If you're interested in helping improve Proximity Message Solution, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes.
4. Push to your branch.
5. Submit a pull request.

## License
This project is licensed under the [MIT License](LICENSE). See the LICENSE file for more details.

## Acknowledgments
- This project was inspired by the need for resilient communication methods in disaster-stricken areas.
- Thanks to the open-source community for the invaluable tools and libraries that made this project possible.
