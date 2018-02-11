export const CONN_START           = 'CONN_START';
export const OFFER_CREATE         = 'OFFER_CREATE';
export const ANSWER_CREATE        = 'ANSWER_CREATE';
export const ANSWER_RECV          = 'ANSWER_RECV';
export const OFFER_RECV           = 'OFFER_RECV';
export const ICE_RECV             = 'ICE_RECV';
export const DATA_CHANNEL_CREATE  = 'DATA_CHANNEL_CREATE';
export const DATA_CHANNEL_OPEN    = 'DATA_CHANNEL_OPEN';
export const DATA_CHANNEL_CLOSE   = 'DATA_CHANNEL_CLOSE';
export const DATA_CHANNEL_CONNECT = 'DATA_CHANNEL_CONNECT';

export const DC_MSG_SEND = 'DC_MSG_SEND';
export const DC_MSG_RECV = 'DC_MSG_RECV';

export function iceReceive(candidate) {
  return {
    type: ICE_RECV,
    candidate
  };
}

export function offerReceive(offer) {
  return {
    type: OFFER_RECV,
    offer
  };
}

export function answerReceive(answer) {
  return {
    type: ANSWER_RECV,
    answer
  }
}

export function channelSend(payload) {
  return {
    type: DC_MSG_SEND,
    payload
  };
}

export function channelRecv(payload) {
  return {
    type: DC_MSG_RECV,
    payload
  };
}
