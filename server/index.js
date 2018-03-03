import express from 'express';
import _ from 'lodash';
import WebSocket from 'ws';
import path from 'path';
import webpack from 'webpack';
import wpDevMiddleware from 'webpack-dev-middleware';
import wpHotMiddleware from 'webpack-hot-middleware';
import fs from 'fs';
import http from 'http';
import https from 'https';
import {
  green, 
  yellow, 
  blue,
  logSuccess, 
  logError, 
  logInfo
} from './utils/logHelper';

import {
  checkAndSend,
  updatePeersAvailable
} from './utils/wsHelper';


let useHttps = process.env.USE_HTTPS === 'true';
let wpconf = require(path.join(__dirname, '../webpack.config.js'));
let wss = new WebSocket.Server({port: process.env.WS_PORT || 8080});
let app = express();
let httpServer = http.createServer(app);
let httpsServer = null;

if(useHttps) {
  let key = fs.readFileSync(path.join(__dirname, '../', process.env.PRIVATE_KEY), 'utf8');
  let cert = fs.readFileSync(path.join(__dirname, '../', process.env.CERTIFICATE), 'utf8');
  httpsServer = https.createServer({key, cert}, app);
}

let compiler = webpack(wpconf);
let clients  = [];
let busyClients = [];


app.use(wpDevMiddleware(compiler, {
  publicPath: wpconf.output.publicPath,
  stats: {
    colors: true
  }
}));

app.use(wpHotMiddleware(compiler));
app.use(express.static(path.join(__dirname, '../public')));

app.get('*', (req, res) => {
  console.log('serving:', req.path);
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});


wss.on('connection', (ws) => {
  ws.on('message', (payload) => {

    payload = JSON.parse(payload);
    let sender = _.find(busyClients, (c) => c.uuid === payload.uuid);
    let target = sender && _.find(busyClients, (bc) => bc.uuid === sender.target);

    switch(payload.type) {
      case 'register':
        /* we register the new client on connection, we add
         * it to the available client list */

        clients = [...clients, {uuid: payload.uuid, ws}];
        logSuccess(`client [${yellow(payload.uuid)}] registered`);
        updatePeersAvailable({busy: busyClients, available: clients});
        break;

      case 'getpeer':
        /* we send a random peer from the clients list, and 
         * both get removed from the client list and put onto
         * the busyClients list */

        let tmpSender = clients.splice(_.findIndex(clients, (c) => c.uuid === payload.uuid), 1)[0];
        let tmpTarget = clients.splice(Math.floor(Math.random()) * clients.length, 1)[0];
        console.log(tmpSender.uuid, tmpTarget.uuid);

        sender = Object.assign({}, tmpSender, {target: tmpTarget.uuid});
        target = Object.assign({}, tmpTarget, {target: tmpSender.uuid});

        busyClients   = [...busyClients, sender, target];
        updatePeersAvailable({busy: busyClients, available: clients});

        break;
      case 'icecandidate':
        /* when we receive an ice candidate, we send it to
         * the target client (receptor) */

        logInfo('ice-candidate sent by', yellow(payload.uuid));
        checkAndSend('ice-candidate', payload, target);

        break;
      case 'offer':
        /* we capture the offer sent by the initiating
         * peer and send it over the receptor peer */

        logInfo('offer sent by', yellow(payload.uuid));
        checkAndSend('offer', payload, target);

        break;
      case 'answer':
        /* we capture the answer sent by the other peer
         * and send it back to the offering peer */
        
        logInfo('answer sent by', yellow(payload.uuid));
        checkAndSend('answer', payload, target);

        break;
      case 'getuser':
        console.log('--------- BUSY ----------');
        _.forEach(busyClients, c => console.log(c.uuid));
        console.log('--------- FREE ----------');
        _.forEach(clients, c => console.log(c.uuid));
        break;
      default:
        logInfo(yellow(payload.uuid), 'says:', payload.content);
        break;
    }
  });

  ws.on('close', () => {
    logInfo('client disconnected');
    clients     = _.filter(clients, (c) => c.ws.readyState !== 3);
    busyClients = _.filter(busyClients, (c) => c.ws.readyState !== 3);
    updatePeersAvailable({busy: busyClients, available: clients});
  });

  ws.on('error', (err) => {
    logError('websocket error', err);
  });
});

if(useHttps){
  httpsServer.listen(process.env.APP_PORT || 3000, () => {
    logSuccess(`secure listening on port: ${process.env.APP_PORT || 3000}`);
    logSuccess(`secure websocket server on port: ${process.env.WS_PORT || 8080}`);
  });
} else {
  httpServer.listen(process.env.APP_PORT || 3000, () => {
    logSuccess(`insecure listening on port: ${process.env.APP_PORT || 3000}`);
    logSuccess(`insecure websocket server on port: ${process.env.WS_PORT || 8080}`);
  });
}
