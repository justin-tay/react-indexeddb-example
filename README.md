# React IndexedDB Example

```shell
npm create vite@latest react-indexeddb-example -- --template react-ts
```

## IndexedDB

IndexedDB can be used to store large amounts of data on the client subject to a quota. In comparison `Local Storage` is limited to [5 MiB per origin](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria).

The quota can be determined using

```javascript
navigator.storage.estimate();
```

It can also be seen in Developer Tools in the `Application` tab under `Storage`.

Note that IndexedDB storage is considered site data and policies affecting this is typically grouped as `Cookies and other site data`.

The following are site data

* Local and session storage
* IndexedDB
* Web SQL (Deprecated)
* Cookies
* Cache storage
* Origin Private File System (File System API)

## File System Access API

The [File System Access API](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access) enables browser applications to access the file system outside the sandbox environment. This API has limited adoption and is largely [limited](https://caniuse.com/native-filesystem-api) to desktop Chromium browsers.

This API requires user interaction for permission but it is possible to acquire persistent permission. This however requires the user to know how to use the system. These permissions can be revoked by the user at any time.

The application can prompt the user to select a directory using a directory picker which can only start in predefined directories, defaulting to the `Documents` directory if not specified. The browser can choose not to let the user pick a particular directory with a `can't open the folder because it contains system files` message. After a directory is selected the user is asked `Let site edit files?`. It is not possible to ask at this time for persistent permission. When the browser is closed and reopened, the application can then prompt `View and edit files for the last time you visited this site` with 3 options, `Allow this time`, `Allow on every visit` and `Don't allow`. It is possible for the user to modify all these settings by clicking on the icon next to the browser address bar.

## Microsoft Edge Policy

Microsoft Edge can be configured via policies. When configured clicking on the `three dots icon` for `Settings and more` will display `Managed by your organization` with a briefcase icon.

The policies can be easily viewed by going to `edge://policy`.

Guidance should be taken from the [Microsoft Edge Security Technical Implementation Guide](https://stigviewer.com/stigs/microsoft_edge).

### Prevent user from manually clearing site data

There is no in-built policy to prevent the user from manually clearing the site data. If the user chooses to do so, site data such as IndexedDB will be cleared.

One possible workaround is to disable the `Settings` page completely using the `URLBlocklist` policy.

```
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Edge\URLBlocklist]
"1"="edge://settings"
```

### Prevent browser from automatically clearing site data

Microsoft Edge automatically clears the site data for the following reasons

* Due to storage pressure
* Due to `Privacy, search and services` settings to automatically `Delete browsing data` when configuring `Choose what to clear every time you close the browser`

#### Storage Pressure

There is no policy to disable automatic clearing of site data due to storage pressure. This can only be done using the `Storage API` with a call to []`navigator.storage.persist()`](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist).

Note that Microsoft Edge does not prompt the user to ask for permission to persist and uses a heuristic to automatically determine if it will grant permission to persist.

In practice the following conditions must be true, as the other conditions can be difficult to satisfy

* The application must be a Progressive Web Application and must be installed
* The application must be in a secure HTTPS context. (There is no exception for `localhost`, it must be `https://localhost` and not `http://localhost`)

```javascript
if (navigator.storage && navigator.storage.persist) {
  const persisted = await navigator.storage.persist();
  console.log(`Persisted storage granted: ${persisted}`);
}
```

#### Privacy Settings

By default Microsoft Edge does not clear cookies and other site data on exit.

Note that the Microsoft Edge Security Technical Implementation Guide recommends that [Session only-based cookies must be enabled](https://stigviewer.com/stigs/microsoft_edge/2024-09-13/finding/V-260467). This sets the `DefaultCookiesSetting` policy to `4` which will clear cookies and other site data on exit.

The `SaveCookiesOnExit` policy needs to be added to ensure that the browser does not clear the site data for the application automatically.

```
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Edge\SaveCookiesOnExit]
"1"="https://localhost:4173"
```

### Automatically install the Progressive Web Application

It is possible to set up a policy to automatically install a Progressive Web Application. This makes it more likely for the application's `Storage API` call to set the site data to be persistent to be successful.

```
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Edge]
"WebAppInstallForceList"="[{\"create_desktop_shortcut\": true, \"default_launch_container\": \"window\", \"url\": \"https://localhost:4173\"}]"
```

## Cryptography

Both browsers and Node implement the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API). On browsers this is only available in secure contexts and can be accessed by `window.crypto`. On current versions of Node it can be accessed using the global `crypto` variable. Access to most functionality is by accessing the `crypto.subtle` member. These are implementations of the [Crypto](https://developer.mozilla.org/en-US/docs/Web/API/Crypto) and [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) interface.

Note that there is [no access](https://www.w3.org/TR/WebCryptoAPI/#scope-out-of-scope) to the operating system key or trust stores, nor access to smart cards.

It is likely not possible to achieve non-repudiation for a web application. By its nature a web application is run with a javascript engine and it is possible via cross-site script injection to run malicious code that may either misrepresent the intent to the user to perform signing, or automatically sign data without the user knowing.

In the face of a cross-site script, it is only possible to make it such that the attacker cannot steal the key, but cannot prevent its use while the cross-site script is running. This can be done by generating a non-extractable key and storing the CryptoKey handle in IndexedDB. Note that this key will be cleared along with other site data. Also note that the specification places [no requirements](https://www.w3.org/TR/WebCryptoAPI/#security-developers) on how the underlying cryptographic key material is stored. In particular, it does not guarantee that the underlying cryptographic key material will not be persisted to disk, possibly unencrypted, nor that it will be inaccessible to users or other applications running with the same privileges as the User Agent.