import express from 'express';
import _ from 'lodash';
import WebSocket from 'ws';
import path from 'path';
import webpack from 'webpack';
import wpDevMiddleware from 'webpack-dev-middleware';
import wpHotMiddleware from 'webpack-hot-middleware';
import {
  green, 
  yellow, 
  blue,
  logSuccess, 
  logError, 
  logInfo
} from './utils/logHelper';

let wss = new WebSocket.Server({port: 8080});
let app = express();
let wpconf = require(path.join(__dirname, '../webpack.config.js'));

let compiler = webpack(wpconf);
let clients  = [];

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
    let targetClients = _.filter(clients, (c) => c.uuid !== payload.uuid);

    switch(payload.type) {
      case 'register':
        clients = [...clients, {uuid: payload.uuid, ws}];
        logSuccess(`client [${yellow(payload.uuid)}] registered`);
        break;
      case 'icecandidate':
        logInfo(green(payload.uuid), 'has ice-candidate');

        _.forEach(targetClients, (c) => {
          c.ws.send(JSON.stringify(payload.content));
          logSuccess('ice-candidate sent to:', c.uuid);
        });

        break;
      case 'offer':
        logInfo(green(payload.uuid), 'has offer');

        _.forEach(targetClients, (c) => {
          c.ws.send(JSON.stringify(payload.content));
          logSuccess('offer sent to:', c.uuid);
        });

        break;
      case 'answer':
        logInfo(blue(payload.uuid), 'is answering offer');
        _.forEach(targetClients, (c) => {
          c.ws.send(JSON.stringify(payload.content));
          logSuccess('answer sent to:', c.uuid);
        })
        break;
      case 'logonline':
        console.log('----------- ONLINE CLIENTS -------------')
        _.forEach(clients, (c) => console.log(`[${green('o')}] ${c.uuid}`))
        break;
      default:
        logInfo(yellow(payload.uuid), 'says:', payload.content);
        break;
    }
  });

  ws.on('close', () => {
    logInfo('client disconnected');
    clients = _.filter(clients, (client) => client.ws.readyState !== 3);
  })
});

app.listen(process.env.APP_PORT, () => {
  if(process.env.APP_PORT === undefined) throw Error('[ERR] port not defined');
  logSuccess(`listening on port: ${process.env.APP_PORT}`);
});
