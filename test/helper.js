/**
 * helper.js - Test helper.
 * node v0.10.x
 */
(function(root, undefined) {
  'use strict';

  var path = require('path'),
      chai = require('chai');

  chai.use(require('sinon-chai'));
  require('mocha-sinon');

  // Set global variables.
  global.expect = chai.expect;

  // Helper plugins.
  module.exports = {
  };
}(this));
