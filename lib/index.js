/**
 * parse-superagent.js - Parse.com rest api client.
 */
(function(root, undefined) {
  'use strict';

  var superTest;
  try {
    superTest = require.resolve('supertest');
  } catch (ex) {
    superTest = null;
  }

  var path = require('path'),
      superAgent = require('superagent');

  if (superTest) {
    superTest = require(superTest);
  }

  /**
   * @constructor
   */
  function ParseSuperAgent(options) {
    options || (options = {});
    this.apiBase = 'https://api.parse.com';
    this.apiVer = options.apiVer || '1';
    this.initialize(options);
  }
  ParseSuperAgent.constructor = ParseSuperAgent;

  /**
   * Set up parse settings.
   * @param {Object.<(string|boolean)>=} options Parse application keys.
   */
  ParseSuperAgent.prototype.initialize = function(options) {
    options || (options = {});
    this.applicationId = options.applicationId || process.env.NODE_PARSE_APP_ID;
    this.restApiKey = options.restApiKey || process.env.NODE_PARSE_REST_API_KEY;
    this.masterKey = options.masterKey || process.env.NODE_PARSE_MASTER_KEY;
    if (typeof options.useMasterKey === 'boolean') {
      this.useMasterKey = options.useMasterKey;
    } else if (parseInt(process.env.NODE_USE_PARSE_MASTER_KEY || 0, 10)) {
      this.useMasterKey = true;
    } else {
      this.useMasterKey = false;
    }
    this.env = options.env || process.env.NODE_ENV;
    if (this.env === 'testing' && !!!superTest) {
      console.warn('supertest not found!!');
    }
  };

  /**
   * Parse authentication keyset.
   *
   * @param {{useMasterKey: boolean}} options A keySet flag.
   * @return {Object} Parse authentication keyset.
   */
  ParseSuperAgent.prototype.keySet = function(options) {
    options || (options = {});

    var keySet = {
      'X-Parse-Application-Id': this.applicationId,
      'X-Parse-REST-API-Key': this.restApiKey
    };
    if (options.useMasterKey === true || this.useMasterKey === true) {
      keySet['X-Parse-Master-Key'] = this.masterKey;
    }
    return keySet;
  };

  /**
   * urlPath for Parse rest api.
   * @param {...string} va_args A url path part.
   * @return {string} The url path that joined all arguments.
   */
  ParseSuperAgent.prototype.pathJoin = function(va_args) {
    return path.join.apply('', arguments);
  };

  ParseSuperAgent.prototype.request = function(method, urlPath, params, query, options) {
    var request;
    if (this.env === 'testing' && superTest) {
      request = superTest(this.apiBase)[method](urlPath);
    } else {
      request = superAgent[method](this.apiBase + urlPath);
    }
    return request
      .type('application/json')
      .set(this.keySet(options))
      .query(query || {})
      .send(params || {});
  };

  /**
   * Send the request to run Parse cloud function.
   * @param {string} name A cloud function name.
   * @param {Object=} params A request data.
   * @param {Object=} options A flags that control the object behaviour.
   * @return {Object} The request object provided by superagent.
   */
  ParseSuperAgent.prototype.runFunction = function(name, params, options) {
    var urlPath = this.pathJoin('/', this.apiVer, 'functions', name);
    return this.request('post', urlPath, params, null, options);
  };

  /**
   * Send the request to run Parse cloud background job.
   * @param {string} name A cloud background job name.
   * @param {Object=} params A request data.
   * @param {Object=} options A flags that control the object behaviour.
   * @return {Object} The request object provided by superagent.
   */
  ParseSuperAgent.prototype.runBackgroundJob = function(name, params, options) {
    var urlPath = this.pathJoin('/', this.apiVer, 'jobs', name);
    return this.request('post', urlPath, params, null, options);
  };

  /**
   * Send the batch opration request.
   * @param {Array.<Object>} params A batch opration data list.
   * @return {Object} The request object provided by superagent.
   */
  ParseSuperAgent.prototype.sendBatchRequest = function(params, options) {
    var urlPath = this.pathJoin('/', this.apiVer, 'batch');
    return this.request('post', urlPath, params, null, options);
  };

  /**
   * Send the request for Parse.com rest api.
   * @param {string} method A HTTP request method.
   * @param {string} requestPath A Parse reset api request path.
   * @param {Object=} params A request data(POST PUT).
   * @param {Object=} query A request query string(GET).
   * @param {Object=} options A flags that control the object behaviour.
   * @return {Object} The request object provided by superagent.
   */
  ParseSuperAgent.prototype.send = function(method, requestPath, params, query, options) {
    options || (options = {});
    var urlPath = requestPath;
    method = method.toLowerCase();
    method = method === 'delete' ? 'del' : method;
    return this.request(method, urlPath, params, query, options);
  };

  module.exports = ParseSuperAgent;
}(this));
