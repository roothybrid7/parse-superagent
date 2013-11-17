/**
 * helper.js - Test helper.
 * node v0.10.x
 */
(function(root, undefined) {
  'use strict';

  var path = require('path'),
      chai = require('chai'),
      sinon = require('sinon');

  chai.use(require('sinon-chai'));

  // Set global variables.
  global.expect = chai.expect;
  global.sinon = sinon;

  // Helper plugins.
  module.exports = {
  };
}(this));
