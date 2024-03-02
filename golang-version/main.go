package main

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"io/ioutil"
	"os"

	"github.com/google/uuid"
)

func main() {
	uuidFilename := "uuid.txt"
	keysFilename := "keys.txt"

	// Check if uuid.txt and keys.txt exist
	if _, uuidErr := os.Stat(uuidFilename); os.IsNotExist(uuidErr) {
		if _, keysErr := os.Stat(keysFilename); os.IsNotExist(keysErr) {
			// Both files do not exist, generate new UUID and keys
			id := uuid.New()
			if err := ioutil.WriteFile(uuidFilename, []byte(id.String()), 0644); err != nil {
				fmt.Println("Error writing UUID file:", err)
				return
			}

			// Generate RSA keys
			privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
			if err != nil {
				fmt.Println("Error generating RSA key:", err)
				return
			}
			publicKey := &privateKey.PublicKey

			// Encode and save keys
			saveKeys(privateKey, publicKey)
			fmt.Printf("Generated new UUID: %s and keys\n", id.String())
		} else {
			fmt.Println("Keys file already exists")
		}
	} else {
		fmt.Println("UUID file already exists")
	}
}

func saveKeys(privateKey *rsa.PrivateKey, publicKey *rsa.PublicKey) {
	// Encode private key to PEM format
	privateKeyBytes := x509.MarshalPKCS1PrivateKey(privateKey)
	privateKeyBlock := &pem.Block{
		Type:  "RSA PRIVATE KEY",
		Bytes: privateKeyBytes,
	}
	privatePEM := pem.EncodeToMemory(privateKeyBlock)

	// Encode public key to PEM format
	publicKeyBytes, err := x509.MarshalPKIXPublicKey(publicKey)
	if err != nil {
		fmt.Println("Error marshalling public key:", err)
		return
	}
	publicKeyBlock := &pem.Block{
		Type:  "PUBLIC KEY",
		Bytes: publicKeyBytes,
	}
	publicPEM := pem.EncodeToMemory(publicKeyBlock)

	// Save private key to private.txt
	if err := ioutil.WriteFile("private.txt", privatePEM, 0644); err != nil {
		fmt.Println("Error writing private key file:", err)
	}

	// Save public key to public.txt
	if err := ioutil.WriteFile("public.txt", publicPEM, 0644); err != nil {
		fmt.Println("Error writing public key file:", err)
	}
}


