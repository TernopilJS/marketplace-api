# Apiko courses 2019 application API

API - https://apiko-marketplace-api-2019.herokuapp.com/

API Docs - https://apiko-marketplace-api-2019.herokuapp.com/documentation

## Local Server Installation

Clone repository and install project dependencies
```bash
git clone git@github.com:TernopilJS/marketplace-api.git
cd marketplace-api
npm i
```

Follow your OS specific instructions:
- macOS [instructions](doc/quickstart.macos.md).

- Linux [instructions](doc/quickstart.linux.md).

- With Windows just go for [Linux subsystem for Windows](https://docs.microsoft.com/en-us/windows/wsl/install-win10) and proceed with the Linux instructions.

### Cloudinary
To upload images or some other multimedia - create free account on [cloudinary](https://cloudinary.com/)
and paste your cloudinary configs into [config file](src/config.js#L13).

### SQL syntax highlight in js files.

Use [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=dgadelha.vscode-sql-template-literal-with-prefixes) for
Syntax highlighting for code like:

```js
const query = sql`SELECT * FROM users`;
```


### Run server
Start the server, e.g:
```bash
node index.js
```
or build and run:
```bash
npm run build && npm start
```
or whatever method you want.

## Deploy on [Heroku](https://dashboard.heroku.com)

```bash
git clone git@github.com:TernopilJS/marketplace-api.git
cd marketplace-api
```
Follow the deployment [instructions](doc/heroku.md)
