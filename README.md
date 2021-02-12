# https-fetch #
Fetch data from famous websites

## Installation ##
### [NPM](https://npmjs.com/package/https-fetch/)
```
npm i https-fetch
```
### [Git](https://github.com/YugoRei/https-fetch)
```
git clone https://github.com/YugoRei/https-fetch.git
```

## How to use ##
```js
const https = require("https-fetch");

// Fetch from YouTube.com
https.youtube(query, limit).then(console.log)
```

## Test ##
```
npm run test
```

## Supported websites ##
1. [YouTube](https://youtube.com/)

More websites will be added soon

## Note ##
Every functions here returns a promise