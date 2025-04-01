# React IndexedDB Example

```shell
npm create vite@latest react-indexeddb-example -- --template react-ts
```

git remote add origin https://github.com/justin-tay/react-indexeddb-example.git

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

## Edge Policy

Microsoft Edge can be configured via policies. When configured clicking on the `three dots icon` for `Settings and more` will display `Managed by your organization` with a briefcase icon.

The policies can be easily viewed by going to `edge://policy`.

Guidance should be taken from the [Microsoft Edge Security Technical Implementation Guide](https://stigviewer.com/stigs/microsoft_edge).

### Prevent user from manually clearing site data

There is no in-built policy to prevent the user from manually clearing the site data. If the user chooses to do so, site data such as IndexedDB will be cleared.

One possible workaround is to disable the `Settings` page completely using the `URLBlocklist` policy.





```
SOFTWARE\Policies\Microsoft\Edge\WebAppInstallForceList = [{"create_desktop_shortcut": true, "default_launch_container": "window", "url": "https://localhost:4173"}]
SOFTWARE\Policies\Microsoft\Edge\SaveCookiesOnExit\1 = "https://localhost:4173"
SOFTWARE\Policies\Microsoft\Edge\URLBlocklist\1 = "edge://settings"
```