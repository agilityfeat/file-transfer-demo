import {
  CONN_START,
  OFFER_CREATE,
  ANSWER_CREATE,
  ANSWER_RECV,
  OFFER_RECV,
  ICE_RECV,
  DATA_CHANNEL_CREATE,
  DATA_CHANNEL_OPEN,
  DATA_CHANNEL_CLOSE,
  DATA_CHANNEL_CONNECT,
  DC_MSG_RECV,
  DC_MSG_SEND,
  channelRecv
} from '../actions/webrtcActions';
import {wsSendMessage} from '../actions/wsActions';

let conn = null;
let channel = null;
let uuid = null;

function addChannelCallbacks(channel, dispatch) {
  channel.onopen = () => dispatch({type: DATA_CHANNEL_OPEN});
  channel.onclose = () => dispatch({type: DATA_CHANNEL_CLOSE});
  channel.onmessage = (e) => dispatch(channelRecv(JSON.parse(e.data)));
  return channel;
}


export const webrtcMiddleware = store => next => action => {
  const {dispatch, getState} = store;

  switch(action.type) {
    case CONN_START:
      uuid = getState().websocket.uuid;
      conn = new RTCPeerConnection();

      conn.onicecandidate = (e) => {
        e.candidate && dispatch(wsSendMessage({
          type: 'icecandidate',
          uuid,
          content: e.candidate
        }));
      };

      next(action);
      dispatch(wsSendMessage({type: 'getpeer', uuid}));
      dispatch({type: DATA_CHANNEL_CREATE, name: `channel-${uuid}`});
      break;
    case DATA_CHANNEL_CREATE:
      channel = conn.createDataChannel(action.name);
      channel = addChannelCallbacks(channel, dispatch);

      next(action);
      dispatch({type: OFFER_CREATE});
      break;
    case DATA_CHANNEL_CONNECT:
      channel = action.event.channel;
      channel = addChannelCallbacks(channel, dispatch);

      next(action);
      break;
    case OFFER_CREATE:
      uuid = getState().websocket.uuid;

      conn.createOffer().then(offer => {
        dispatch(wsSendMessage({
          type: 'offer',
          content: offer,
          uuid: uuid
        }));
        return conn.setLocalDescription(offer);
      }).then(() => {
        next(action);
      });

      break;
    case OFFER_RECV:
      conn = new RTCPeerConnection();
      conn.setRemoteDescription(action.offer);
      conn.ondatachannel = (event) => dispatch({type: DATA_CHANNEL_CONNECT, event});

      next(action);
      dispatch({type: ANSWER_CREATE});
      break;
    case ANSWER_CREATE:
      uuid = getState().websocket.uuid;

      conn.createAnswer().then(answer => {
        dispatch(wsSendMessage({
          type: 'answer',
          content: answer,
          uuid: uuid
        }));
        return conn.setLocalDescription(answer);
      }).then(() => {
        next(action);
      });

      break;
    case ANSWER_RECV:
      conn.setRemoteDescription(action.answer);
      next(action);
      break;
    case ICE_RECV:
      let candidate = new RTCIceCandidate(action);
      conn.addIceCandidate(candidate);

      next(action);
      break;
    case DC_MSG_SEND:
      channel.send(JSON.stringify(action.payload));

      next(action);
      break;
    default:
      next(action);
  }
}
