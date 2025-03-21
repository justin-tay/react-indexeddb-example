import { useEffect, useLayoutEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { encryptText, decryptText, getKey } from "./crypto";
import { db } from "./db";

async function persist() {
  if (navigator.storage && navigator.storage.persist) {
    const persisted = await navigator.storage.persist();
    console.log(`Persisted storage granted: ${persisted}`);
  }
}

function App() {
  const initialized = useRef(false);
  const [count, setCount] = useState(0);

  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');

  async function onSubmit(formData: FormData) {
    const key = await getKey();
    const action = formData.get('action');
    if (action === 'encrypt') {
      const plaintext = formData.get('plaintext') as string;
      const encryptedData = await encryptText(key, plaintext);
      const base64String = btoa(
        String.fromCharCode(...new Uint8Array(encryptedData))
      );
      setPlaintext(plaintext)
      setCiphertext(base64String);
    } else {
      const ciphertext = formData.get('ciphertext') as string;
      const encryptedData = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0))
      const plaintext = await decryptText(key, encryptedData);
      setPlaintext(plaintext);
      setCiphertext(ciphertext);
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
            <input id="plaintext" name="plaintext" defaultValue={plaintext}></input>
          </li>
          <li className="form-row">
            <label htmlFor="ciphertext">Ciphertext</label>
            <input id="ciphertext" name="ciphertext" defaultValue={ciphertext}></input>
          </li>
          <li className="form-row">
            <button type="submit" name="action" value="encrypt">Encrypt</button>
            <button type="submit" name="action" value="decrypt">Decrypt</button>
          </li>
        </form>
      </div>
    </>
  );
}

export default App;
