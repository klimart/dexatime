### Development Essentials

* Start local dev environment - electron (backend) + webpack (for react.js)
```
npm run dev
```

### Create AppImage
1. Set version in package.json
2. Adjust productName if needed in package.json
3. Update build assets. Run ```npm run build```
4. Generate AppImage distribution. Run ```npm run dist```
5. Grab generated .AppImage file in /dist directory

### Troubleshooting
* Error:
> NODE_MODULE_VERSION 72. This version of Node.js requires NODE_MODULE_VERSION 73. Please try re-compiling or re-installing \\/

Every time you run "npm install", run this:
> ./node_modules/.bin/electron-rebuild
>

[Change Log](./Changelog.md)