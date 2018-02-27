# file-transfer-demo

A small peer to peer file transfer demo, implemented with WebSocket signaling, React, Redux and WebRTC data channels
to illustrate the flow of RTCPeer connections and datachannels, with the use of `redux-logger`
for a clear and consice way of illustrating the flow of data.

## Running the Demo

All you need to do in order to get started is:

```
$ git clone https://github.com/agilityfeat/file-transfer-demo && cd file-transfer-demo
$ cp ./.env.example ./.env && cp ./client/config.example.js ./client/config.js
$ npm i
```

After that one time only setup, run:

```
$ npm start
```

and navigate to `http://localhost:3000`, in several chats to use the demo, open several tabs
or use in diferent devices to stablish a random connection between two peers, chat and transfer
files, all with the help of WebRTC data channels.

## Further Configuration

#### client/config.js

You can update this values in order to setup your TURN/STUN servers or reduce the amount of log
that the application will display on your browser, this will increase the speed of the application
and reduce the clutter on your console.

```js
const config = {
  wsUrl: `ws://${location.host}:8080`,
  stun: {
    "urls": "stun:stun.l.google.com:19302"
  },
  turn: {
    "urls": "",
    "credential": "",
    "user": ""
  },
  useTurn: false,
  reduxLog: true
};

export default config;
```


#### .env

In this file you can adjust the ports that you wish to use when running
the demo.

```sh
export APP_PORT=3000
export WS_PORT=8080
```
