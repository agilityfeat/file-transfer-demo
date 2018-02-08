import express from 'express';
import _ from 'lodash';
import WebSocket from 'ws';
import path from 'path';
import webpack from 'webpack';
import wpDevMiddleware from 'webpack-dev-middleware';
import wpHotMiddleware from 'webpack-hot-middleware';

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
    switch(payload.type) {
      case 'register':
        clients = [...clients, {uuid: payload.uuid, ws}];
        console.log(`[OK] client [${payload.uuid}] registered`);
        console.log('----------- ONLINE CLIENTS -------------')
        _.forEach(clients, (client) => console.log(`[o] ${client.uuid}`))
    }
  });

  ws.on('close', () => {
    console.log('client disconnected');
    clients = _.filter(clients, (client) => client.ws.readyState !== 3);
  })
});

app.listen(process.env.APP_PORT, () => {
  if(process.env.APP_PORT === undefined) throw Error('[ERR] port not defined');
  console.log(`[OK] listening on port: ${process.env.APP_PORT}`);
});
