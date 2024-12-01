import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { encryptText, getKey } from "./crypto";

async function test() {
  const key = await getKey();
  const encryptedData = await encryptText(key, 'hello');
  const base64String = btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
  console.log(base64String);
}

async function persist() {
  if (navigator.storage && navigator.storage.persist) {
    const persisted = await navigator.storage.persist();
    console.log(`Persisted storage granted: ${persisted}`);
  }
}

function App() {
  const [count, setCount] = useState(0);
  persist();

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
        <button onClick={() => test()}>
          Test
        </button>
      </div>
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
    </>
  );
}

export default App;
