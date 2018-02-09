export const CONN_START          = 'CONN_START';
export const OFFER_CREATE        = 'OFFER_CREATE';
export const ANSWER_CREATE       = 'ANSWER_CREATE';
export const OFFER_RECV          = 'OFFER_RECV';
export const ICE_RECV            = 'ICE_RECV';
export const DATA_CHANNEL_CREATE = 'DATA_CHANNEL_CREATE';
export const DATA_CHANNEL_OPEN   = 'DATA_CHANNEL_OPEN';
export const DATA_CHANNEL_CLOSE  = 'DATA_CHANNEL_CLOSE';

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
