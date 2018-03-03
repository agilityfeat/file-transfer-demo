const config = {
  wsUrl: `ws://${location.hostname}:8080`,
  stun: {
    "urls": "stun:stun.l.google.com:19302"
  },
  turn: {
    "urls": "",
    "credential": "",
    "username": ""
  },
  useTurn: false,
  reduxLog: true
};

export default config;
