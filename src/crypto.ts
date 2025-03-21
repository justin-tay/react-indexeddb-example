import { db } from "./db";

async function addKey(key: CryptoKey) {
  return await db.keys.put({
    id: 1,
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
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv, // Initialization vector must be unique for each encryption
    },
    key, // The generated key
    data, // The text data to encrypt
  );
  const encryptedData = new Uint8Array(encrypted);
  const result = new Uint8Array(iv.length + encryptedData.length);
  result.set(iv);
  result.set(encryptedData, iv.length);
  return result;
}

async function decryptData(key: CryptoKey, data: ArrayBuffer) {
  const iv = new Uint8Array(data.slice(0, 12)); // first 12 bytes
  const encrypted = new Uint8Array(data.slice(12));
  return await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key, // The generated key
    encrypted, // The text data to decrypt
  );
}

async function encryptText(key: CryptoKey, text: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    return await encryptData(key, data);
}

async function decryptText(key: CryptoKey, data: ArrayBuffer) {
  const decoder = new TextDecoder();
  const chars = await decryptData(key, data);
  return decoder.decode(chars);
}

export { addKey, getKey, generateKey, encryptData, encryptText, decryptData, decryptText};