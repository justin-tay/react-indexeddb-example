import { useEffect, useLayoutEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { encryptText, decryptText, getKey } from "./crypto";
import { db } from "./db";
import { register, verifySignature, webauthnAbortController, extractAaguid } from "./webauthn";

async function persist() {
  if (navigator.storage && navigator.storage.persist) {
    const persisted = await navigator.storage.persist();
    console.log(`Persisted storage granted: ${persisted}`);
  }
}

function App() {
  const initialized = useRef(false);
  const [count, setCount] = useState(0);

  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");

  async function onSubmit(formData: FormData) {
    const key = await getKey();
    const action = formData.get("action");
    if (action === "encrypt") {
      const plaintext = formData.get("plaintext") as string;
      const encryptedData = await encryptText(key, plaintext);
      const base64String = btoa(
        String.fromCharCode(...new Uint8Array(encryptedData))
      );
      setPlaintext(plaintext);
      setCiphertext(base64String);
    } else {
      const ciphertext = formData.get("ciphertext") as string;
      const encryptedData = Uint8Array.from(atob(ciphertext), (c) =>
        c.charCodeAt(0)
      );
      const plaintext = await decryptText(key, encryptedData);
      setPlaintext(plaintext);
      setCiphertext(ciphertext);
    }
  }

  async function onClick() {
    db.handle.get(1).then(async (result) => {
      let directoryHandle;
      if (!result) {
        directoryHandle = await (window as any).showDirectoryPicker({
          id: "data",
          startIn: "documents",
          mode: "readwrite",
        });
        db.handle.put({ id: 1, handle: directoryHandle }).then(() => {
          console.log("stored directory");
        });
      } else {
        directoryHandle = result.handle;
      }

      await verifyPermission(directoryHandle, true);

      const filename = `${crypto.randomUUID()}.txt`;
      let fileHandle = await directoryHandle.getFileHandle(filename, {
        create: true,
      });
      let writable = await fileHandle.createWritable();
      await writable.write(crypto.randomUUID());
      await writable.close();
      console.log(`wrote ${filename}`);
    });
  }

  async function verifyPermission(fileHandle: any, readWrite: boolean) {
    let options = {};
    if (readWrite) {
      options = { mode: "readwrite" };
    }
    // Check if permission was already granted. If so, return true.
    if ((await fileHandle.queryPermission(options)) === "granted") {
      return true;
    }
    // Request permission. If the user grants permission, return true.
    if ((await fileHandle.requestPermission(options)) === "granted") {
      return true;
    }
    // The user didn't grant permission, so return false.
    return false;
  }

  async function onRegister() {
    const id = `user-id-${window.crypto.randomUUID()}`;
    const user: PublicKeyCredentialUserEntity = {
      id: new TextEncoder().encode(id),
      name: "kiosk.user@example.com",
      displayName: "Kiosk User",
    };
    const credential = await register(user);
    if (credential) {
      console.log(credential);
      console.log(JSON.stringify(credential));
      const publicKeyCredential = credential as PublicKeyCredential;
      const publicKey = (publicKeyCredential.response as AuthenticatorAttestationResponse).getPublicKey();
      const aaguid = extractAaguid((publicKeyCredential.response as AuthenticatorAttestationResponse).getAuthenticatorData());
      console.log(aaguid);
      if (publicKey) {
        db.users
        .put({
          id,
          publicKey,
          credential: JSON.parse(JSON.stringify(publicKeyCredential)),
        })
        .then(() => {
          console.log(`Stored user ${id}`);
        });
      }
    }
  }

  async function onAuthenticate() {
    const { signal } = webauthnAbortController();
    const credential = await navigator.credentials.get({
      publicKey: { challenge: new TextEncoder().encode("/challenge/foo") },
      signal
    });
    console.log(credential);
    console.log(JSON.stringify(credential));
    const publicKeyCredential = credential as PublicKeyCredential;
    const response =
      publicKeyCredential.response as AuthenticatorAssertionResponse;
    await verifySignature(response);
  }

  async function onFocus() {
    try {
      const { signal } = webauthnAbortController();
      const credential = await navigator.credentials.get({
        publicKey: { challenge: new TextEncoder().encode("/challenge/foo") },
        mediation: "conditional",
        signal
      });
      console.log(credential);
      console.log(JSON.stringify(credential));
      const publicKeyCredential = credential as PublicKeyCredential;
      const response =
        publicKeyCredential.response as AuthenticatorAssertionResponse;
      await verifySignature(response);
    } catch (e) {
      // do nothing as it is due to abort
    }
  }

  persist();

  // run once
  useLayoutEffect(() => {
    if (!initialized.current) {
      db.counter.get(1).then((result) => {
        if (!result) {
          // set initial value
          db.counter.put({ id: 1, counter: count }).then(() => {
            console.log("initialized");
          });
        } else {
          setCount(result.counter);
        }
        initialized.current = true;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // run each time count changes
  useEffect(() => {
    if (initialized.current) {
      db.counter.update(1, { counter: count }).then(() => {
        console.log("updated");
      });
    }
  }, [count]);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div className="card">
        <form action={onSubmit} className="form">
          <li className="form-row">
            <label htmlFor="plaintext">Plaintext</label>
            <input
              id="plaintext"
              name="plaintext"
              defaultValue={plaintext}
            ></input>
          </li>
          <li className="form-row">
            <label htmlFor="ciphertext">Ciphertext</label>
            <input
              id="ciphertext"
              name="ciphertext"
              defaultValue={ciphertext}
            ></input>
          </li>
          <li className="form-row">
            <button type="submit" name="action" value="encrypt">
              Encrypt
            </button>
            <button type="submit" name="action" value="decrypt">
              Decrypt
            </button>
          </li>
        </form>
      </div>
      <div className="card">
        <button onClick={onClick}>Write</button>
      </div>
      <div className="card">
        <button onClick={onRegister}>Register</button>
        <button onClick={onAuthenticate}>Authenticate</button>
      </div>
      <div className="card">
        <li className="form-row">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            autoComplete="username webauthn"
            onMouseEnter={onFocus}
          ></input>
        </li>
      </div>
    </>
  );
}

export default App;
