/**
 * client.js
 */

var parseSuperAgent = require('../lib'),
    events = require('events'),
    eventEmitter = new events.EventEmitter();

// Setup the parse keys by environment variables.
// export NODE_PARSE_APP_ID=<Application ID>
// export NODE_PARSE_REST_API_KEY=<REST API Key>
// export NODE_PARSE_MASTER_KEY=<Master Key>
// export NODE_USE_PARSE_MASTER_KEY=(0|1)

// Or the instantiate arguments.
var client = new parseSuperAgent(/*{
  applicationId: '<Application ID>',
  restApiKey: '<REST API Key>',
  masterKey: '<Master Key>',
  useMasterKey: true  # Or false
}*/);

client.runFunction('hello').end(function(error, response) {
  if (error) {
    throw error;
  }
  console.log(response.body);
  // => { result: 'Hello world!' }
});

client.sendBatchRequest({
          requests: [{
            method: 'POST',
            path: '/1/classes/GameScore',
            body: {
              score: 1337,
              playerName: "Sean Plott"
            }
          }, {
            method: 'POST',
            path: '/1/classes/GameScore',
            body: {
              score: 1338,
              playerName: "ZeroCool"
            }
          }]
}).end(function(error, response) {
  if (error) {
    throw error;
  }
  console.log(response.body);
  // => [ { success:
  // { createdAt: '2013-11-17T14:43:40.296Z',
  // objectId: 'aGFMHhdHBY' } },
  // { success:
  // { createdAt: '2013-11-17T14:43:40.308Z',
  // objectId: 'rpQbB6RXgT' } } ]
  eventEmitter.emit('batchEnd');
});

client.send('POST', '/1/classes/GameScore', {
  score:1337,
  playerName: "Sean Plott",
  cheatMode:false
}).end(function(error, response) {
  if (error) {
    throw error;
  }
  console.log(response.body);
  // => { createdAt: '2013-11-17T14:43:40.297Z',
  // objectId: 'W2tdhLOWKC' }
  eventEmitter.emit('created', response.body.objectId);
});

eventEmitter.on('created', function(objectId) {
  client
    .send('GET', '/1/classes/GameScore/' + objectId)
    .end(function(error, response) {
      if (error) {
        throw error;
      }
      console.log(response.body);
      // => { cheatMode: false,
      // playerName: 'Sean Plott',
      // score: 73453,
      // createdAt: '2013-11-17T14:43:40.297Z',
      // updatedAt: '2013-11-17T14:43:41.432Z',
      // objectId: 'W2tdhLOWKC' }
      eventEmitter.emit('fetched', response.body.objectId);
    });

  client
    .send('PUT', '/1/classes/GameScore/' + objectId, {score: 73453})
    .end(function(error, response) {
      if (error) {
        throw error;
      }
      console.log(response.body);
      // => { updatedAt: '2013-11-17T14:43:41.432Z' }
      eventEmitter.emit('updated', objectId);
    });
});

eventEmitter.on('updated', function(objectId) {
  client
    .send('DELETE', '/1/classes/GameScore/' + objectId)
    .end(function(error, response) {
      if (error) {
        throw error;
      }
      console.log(response.body);
      // => {}
      eventEmitter.emit('deleted', response.body);
    });
});

eventEmitter.on('deleted', function() {
  client
    .send('GET', '/1/classes/GameScore')
    .end(function(error, response) {
      if (error) {
        throw error;
      }
      console.log(response.body);
      // => { results:
      // [ { score: 1337,
      // playerName: 'Sean Plott',
      // createdAt: '2013-11-17T14:43:40.296Z',
      // updatedAt: '2013-11-17T14:43:40.296Z',
      // objectId: 'aGFMHhdHBY' },
      // { score: 1338,
      // playerName: 'ZeroCool',
      // createdAt: '2013-11-17T14:43:40.308Z',
      // updatedAt: '2013-11-17T14:43:40.308Z',
      // objectId: 'rpQbB6RXgT' } ] }
      //     });
      var requests = [];
      var results = response.body.results;
      for (var i = 0, l = results.length; i < l; i++) {
        requests.push({
          method: 'DELETE',
          path: '/1/classes/GameScore/' + results[i].objectId
        });
      }
      eventEmitter.emit('fetchAll', requests);
    });
});

eventEmitter.on('fetchAll', function(requests) {
  // Cleanup.
  client
    .sendBatchRequest({requests: requests})
    .end(function(error, response) {
      if (error) {
        throw error;
      }
      console.log(response.body);
      // => [ { success: true }, { success: true } ]
    });
});
