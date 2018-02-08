export const SEND_MESSAGE  = 'SEND_MESSAGE';
export const SEND_FILE     = 'SEND_FILE';

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


export function connectWs(url) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(wsConnectionStart(url));

      let ws = new WebSocket(url);
      console.log(ws);

      ws.onopen = () => {
        console.log(`ws connected at: ${url}`);
        dispatch(wsConnectionOk());
        resolve(ws);
      };
    });
  }
}
