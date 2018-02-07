export const CONNECT_WS   = 'CONNECT_WS';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SEND_FILE    = 'SEND_FILE';


export function connectWs(url) {
  return {
    type: CONNECT_WS,
    url
  }
}

export function sendMessage({message, timestamp, author}) {
  return {
    type: SEND_MESSAGE,
    message,
    timestamp,
    author
  }
}

export function sendFile({file, timestamp, author}) {
  return {
    type: SEND_FILE,
    file,
    timestamp,
    author
  }
}
