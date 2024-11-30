import { db } from "./db";

async function addKey(key: CryptoKey) {
  return await db.keys.add({
    key,
  });
}

async function getKey() {
    const result = await db.keys.get(1);
    if (!result) {
        const key = await generateKey();
        addKey(key);
        return key;
    }
    return result.key;
}

async function generateKey() {
  return await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256, // 256-bit encryption key for strong security
    },
    false, // The key is not extractable for encryption and decryption
    ["encrypt", "decrypt"] // Key usages: encryption and decryption
  );
}

async function encryptData(key: CryptoKey, data: BufferSource) {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 12-byte IV for AES-GCM
  return await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv, // Initialization vector must be unique for each encryption
    },
    key, // The generated key
    data, // The text data to encrypt
  );
}

async function encryptText(key: CryptoKey, text: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    return await encryptData(key, data);
}

export { addKey, getKey, generateKey, encryptData, encryptText};