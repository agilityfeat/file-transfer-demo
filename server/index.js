import express from 'express';
import WebSocket from 'ws';
import path from 'path';
import webpack from 'webpack';
import wpDevMiddleware from 'webpack-dev-middleware';
import wpHotMiddleware from 'webpack-hot-middleware';

let wss = new WebSocket.Server({port: 8080});
let app = express();
let wpconf = require(path.join(__dirname, '../webpack.config.js'));

let compiler = webpack(wpconf);

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
  console.log('client connected');

  ws.on('message', (message) => {
    console.log(message);
  });
});

app.listen(process.env.APP_PORT, () => {
  if(process.env.APP_PORT === undefined) throw Error('[ERR] port not defined');
  console.log(`[OK] listening on port: ${process.env.APP_PORT}\n`);
});
