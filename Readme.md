### Development Essentials
* Production mode control in index.html
> src/index.html

Development mode
```
<link href="http://localhost:4172/assets/css/main.min.css" rel="stylesheet" type="text/css" />
<script src="http://localhost:4172/bundle.js"></script>
```
Production mode
```
<link href="./build/assets/css/main.min.css" rel="stylesheet" type="text/css" />
<script src="./build/bundle.js"></script>
```
* Start local dev environment - electron (backend) + webpack (for react.js)
```
npm run dev
or
yarn run dev
```
* Reload frontend after changes with Ctrl+R

### Create AppImage
1. Set version in package.json
2. Change src/index.html to support production mode
3. Adjust productName if needed in package.json
4. Update build assets. Run ```npm run build```
5. Generate AppImage distribution. Run ```npm run dist```
6. Grab generated .AppImage file in /dist directory

### Troubleshooting
* Error:
> NODE_MODULE_VERSION 72. This version of Node.js requires NODE_MODULE_VERSION 73. Please try re-compiling or re-installing \\/

Every time you run "npm install", run this:
> ./node_modules/.bin/electron-rebuild
>

[Change Log](./Changelog.md)