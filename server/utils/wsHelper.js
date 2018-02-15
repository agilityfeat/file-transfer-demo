import _ from 'lodash';
import {
  yellow,
  blue,
  green,
  logSuccess, 
  logError, 
  logInfo
} from './logHelper';

export function checkAndSend(what, payload, target) {
  if(target) {
    target.ws.send(JSON.stringify(payload.content));
    logSuccess(`${what} sent to ${blue(target.uuid)}`);
  } else {
    logError(`${what} not sent, target not defined`);
  }
}

export function updatePeersAvailable(clients) {
  logInfo('broadcasting online peers...');
  _.forEach([...clients.busy, ...clients.available], (client) => {
    let targetClients = _.filter(clients.available, (c) => c.uuid !== client.uuid);
    let payload = {
      content: {
        peersAvailable: targetClients.length
      }
    };
    checkAndSend('client-status', payload, client);
  });
}
