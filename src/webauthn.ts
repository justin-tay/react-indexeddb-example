// Use @passwordless-id/webauthn for actual implementation

import { db } from "./db";

function getPublicKey(
  user: PublicKeyCredentialUserEntity
): PublicKeyCredentialCreationOptions {
  return {
    // The challenge is produced by the server; see the Security Considerations
    challenge: Uint8Array.from(window.crypto.randomUUID(), (c) =>
      c.charCodeAt(0)
    ),

    // Relying Party:
    rp: {
      name: "React IndexedDB Example",
    },

    // User:
    user,

    // This Relying Party will accept only an ES256
    pubKeyCredParams: [
      {
        type: "public-key",
        alg: -7, // "ES256" as registered in the IANA COSE Algorithms registry
      },
    ],

    authenticatorSelection: {
      // Try to use UV if possible. This is also the default.
      userVerification: "preferred",
    },

    attestation: "direct", // Set direct attestation to get the aaguid

    timeout: 360000, // 6 minutes
  };
}

export async function register(user: PublicKeyCredentialUserEntity) {
  if (!window.PublicKeyCredential) {
    /* Client not capable. Handle error. */
    throw new Error("WebAuthn not supported.");
  }
  const publicKey = getPublicKey(user);
  const { signal } = webauthnAbortController();
  return await navigator.credentials.create({ publicKey, signal });
}

export function convertEcdsaSignatureAsn1ToRaw(
  derSignature: ArrayLike<number> | ArrayBufferLike
): ArrayBuffer {
  const signatureBytes = new Uint8Array(derSignature);
  // First byte should be 0x30 meaning SEQUENCE
  const rStart = 4;
  const rLength = signatureBytes[3];
  const rEnd = rStart + rLength;
  const derEncodedR = signatureBytes.slice(rStart, rEnd);
  // DER encoded 32 bytes integers can have leading 0x00s or be smaller than 32 bytes
  const r = decodeDERInteger(derEncodedR, 32);

  const sStart = rEnd + 2;
  const sEnd = signatureBytes.byteLength;
  const derEncodedS = signatureBytes.slice(sStart, sEnd);
  // repeat the process
  const s = decodeDERInteger(derEncodedS, 32);

  const ecdsaSignature = new Uint8Array([...r, ...s]);
  return ecdsaSignature.buffer;
}

function decodeDERInteger(
  integerBytes: Uint8Array,
  expectedLength: number
): Uint8Array {
  if (integerBytes.byteLength === expectedLength) return integerBytes;
  if (integerBytes.byteLength < expectedLength) {
    return concatenateUint8Array(
      // add leading 0x00s if smaller than expected length
      new Uint8Array(expectedLength - integerBytes.byteLength).fill(0),
      integerBytes
    );
  }
  // remove leading 0x00s if larger then expected length
  return integerBytes.slice(-32);
}

export function concatenateUint8Array(left: Uint8Array, right: Uint8Array) {
  const result = new Uint8Array(left.length + right.length);
  result.set(left);
  result.set(right, left.length);
  return result;
}

let currentAbortController: AbortController;

export function webauthnAbortController() {
  if (currentAbortController) {
    currentAbortController.abort();
  }
  currentAbortController = new AbortController();
  return currentAbortController;
}

export async function verifySignature(
  response: AuthenticatorAssertionResponse
) {
  if (response.userHandle) {
    const userHandle = new TextDecoder().decode(response.userHandle);
    console.log(userHandle);
    const user = await db.users.get(userHandle);
    if (user) {
      const publicKey = user.publicKey;
      const key = await crypto.subtle.importKey(
        "spki",
        publicKey,
        {
          name: "ECDSA",
          namedCurve: "P-256",
          hash: { name: "SHA-256" },
        },
        false,
        ["verify"]
      );
      const authenticatorData = new Uint8Array(response.authenticatorData);
      console.log("authenticatorData", authenticatorData);
      const clientDataHash = new Uint8Array(
        await crypto.subtle.digest("SHA-256", response.clientDataJSON)
      );
      console.log("clientDataHash", clientDataHash);
      const signedData = concatenateUint8Array(
        authenticatorData,
        clientDataHash
      );
      console.log("signedData", signedData);

      const signature = response.signature;

      // Convert signature from ASN.1 sequence to "raw" concatenated r and s values
      const rawSignature = convertEcdsaSignatureAsn1ToRaw(signature);

      const params = {
        name: "ECDSA",
        namedCurve: "P-256",
        hash: { name: "SHA-256" },
      };
      const verified = await crypto.subtle.verify(
        params,
        key,
        rawSignature,
        signedData.buffer
      );
      console.log("verified", verified);
    }
  }
}

export function extractAaguid(authData: ArrayBuffer): string {
  if (authData.byteLength < 53) {
    return "00000000-0000-0000-0000-000000000000";
  }
  // 32 RP ID Hash
  // 01 Flags
  // 04 Counter
  // 16 AAGUID
  const buffer = authData.slice(37, 53);
  const hex = toHexString(buffer);
  return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(
    12,
    16
  )}-${hex.substring(16, 20)}-${hex.substring(20, 32)}`;
}

function toHexString(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
