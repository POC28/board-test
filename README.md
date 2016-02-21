# Infinity Board

## Install dependencies

`$ npm install`

## Run tests

**Note: this requires a local running mongodb server**

`$ gulp`

## Set environment variables

You need to set the following environment variables for running the server.

```
JWT_SECRET={some random string}
MONGO_URI={mongodb uri}
```

## Start server

`$ gulp run` or `$ node lib/index.js`