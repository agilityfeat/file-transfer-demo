import {
  CONN_START,
  OFFER_CREATE,
  ANSWER_CREATE,
  OFFER_RECV,
  ICE_RECV,
  DATA_CHANNEL_CREATE,
  DATA_CHANNEL_OPEN,
  DATA_CHANNEL_CLOSE
} from '../actions/webrtcActions';

import {wsSendMessage} from '../actions/wsActions';


let conn = null;
let channel = null;
let uuid = null;


export const webrtcMiddleware = store => next => action => {
  const {dispatch, getState} = store;

  switch(action.type) {
    case CONN_START:
      uuid = getState().connection.uuid;
      conn = new RTCPeerConnection();

      conn.onicecandidate = (e) => {
        e.candidate && dispatch(wsSendMessage({
          type: 'icecandidate',
          uuid,
          content: e.candidate
        }));
      };

      next(action);
      dispatch({type: DATA_CHANNEL_CREATE, name: `local-${uuid}`});
      break;
    case DATA_CHANNEL_CREATE:
      channel = conn.createDataChannel(action.name);

      channel.onopen = () => dispatch({type: DATA_CHANNEL_OPEN});
      channel.onclose = () => dispatch({type: DATA_CHANNEL_CLOSE});

      next(action);
      dispatch({type: OFFER_CREATE});
      break;
    case OFFER_CREATE:
      uuid = getState().connection.uuid;

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
      next(action);

      dispatch({type: ANSWER_CREATE});
      break;
    case ANSWER_CREATE:
      uuid = getState().connection.uuid;

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
    case ICE_RECV:
      let candidate = new RTCIceCandidate(action);
      conn.addIceCandidate(candidate);

      next(action);
      break;
    default:
      next(action);
  }
}
