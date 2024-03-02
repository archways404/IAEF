import uuid
import os
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes
from datetime import datetime
import json

def generate_and_read_uuid():
    if os.path.exists("uuid.txt"):
        with open("uuid.txt", "r") as file:
            user_uuid = file.read()
            print("UUID from file: " + user_uuid)
    else:
        user_uuid = str(uuid.uuid4())
        with open("uuid.txt", "w") as file: 
            file.write(user_uuid)
        print("Generated UUID: " + user_uuid)
    return user_uuid

def generate_and_read_pubprivkey():
    if os.path.exists("priv.key") and os.path.exists("pub.key"):
        with open("priv.key", "rb") as file:
            priv = file.read()
            print("Private key from file.")
        with open("pub.key", "rb") as file:
            pub = file.read()
            print("Public key from file.")
    else:
        # Generate private key
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
            backend=default_backend()
        )
        # Generate public key
        public_key = private_key.public_key()

        # Serialize private key
        with open("priv.key", "wb") as file:
            file.write(private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            ))

        # Serialize public key
        with open("pub.key", "wb") as file:
            file.write(public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            ))

        print("Generated and saved new private and public keys.")

def encrypt_message(message, public_key_path):
    # Convert the message from a dictionary to a JSON string
    message_json = json.dumps(message).encode('utf-8')

    # Load the public key
    with open(public_key_path, "rb") as key_file:
        public_key = serialization.load_pem_public_key(
            key_file.read(),
            backend=default_backend()
        )

    # Encrypt the message
    encrypted = public_key.encrypt(
        message_json,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return encrypted

def decrypt_message(encrypted_message, private_key_path):
    # Load the private key
    with open(private_key_path, "rb") as key_file:
        private_key = serialization.load_pem_private_key(
            key_file.read(),
            password=None,  # Assuming the key is not encrypted
            backend=default_backend()
        )

    # Decrypt the message
    original_message_json = private_key.decrypt(
        encrypted_message,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )

    # Convert the JSON string back to a dictionary
    original_message = json.loads(original_message_json.decode('utf-8'))
    return original_message

def main():
    print("Hello World")
    generate_and_read_uuid()
    generate_and_read_pubprivkey()

    message = input("Enter a message: ")
    now = datetime.now()
    formatted_now = now.strftime("%Y-%m-%d %H:%M:%S")
    
    full_message = {
        "metadata": {
          "from (uuid)": generate_and_read_uuid(),
          "timestamp": formatted_now
        },
        "message": message
    }

    # Encrypt for USERB
    encrypted_message = encrypt_message(full_message, "Bpub.key")
    # Save encrypted message to a file (e.g., "encrypted_message_for_userb.bin")
    with open("encrypted_message_for_userb.bin", "wb") as f:
        f.write(encrypted_message)

    # Assuming this file is sent to USERB, and they want to decrypt it:
    # Load the encrypted message from the file
    with open("encrypted_message_for_userb.bin", "rb") as f:
        encrypted_message = f.read()

    # Decrypt by USERB using their private key
    decrypted_message = decrypt_message(encrypted_message, "Bpriv.key")
    print(decrypted_message)

if __name__ == "__main__":
    main()
