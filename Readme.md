## Development Essentials

#### Production mode control in index.html

Development mode
```
<link href="http://localhost:4172/assets/css/main.min.css" rel="stylesheet" type="text/css" />
```
```
<script src="http://localhost:4172/bundle.js"></script>
```
Production mode
```
<link href="./build/assets/css/main.min.css" rel="stylesheet" type="text/css" />
```
```
<script src="./build/bundle.js"></script>
```
* Start local dev environment - electron (backend) + webpack (for react.js)
```
npm run dev
or
yarn run dev
```
* Reload fronent after changes with Ctrl+R

* Error
NODE_MODULE_VERSION 72. This version of Node.js requires NODE_MODULE_VERSION 73. Please try re-compiling or re-installing \\/
* Every time you run "npm install", run this:
./node_modules/.bin/electron-rebuild
