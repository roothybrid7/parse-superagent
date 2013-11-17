/**
 * index_spec.js
 */
(function(root, undefined) {
  'use strict';

  var helper = require('../helper'),
      TargetModule = require('../../lib');

  describe('ParseSuperAgent', function() {
    var keys;

    before(function() {
      keys = {
        applicationId: 'APP_ID',
        restApiKey: 'REST_API_KEY',
        masterKey: 'MASTER_KEY'
      };
    });

    describe('#initialize', function() {
      context('input the parse keys', function() {
        var target;

        beforeEach(function() {
          var options = {};
          for (var k in keys) {
            options[k] = keys[k];
          }
          options.useMasterKey = true;
          target = new TargetModule(options);
        });

        afterEach(function() {
          target = null;
        });

        it('should be set the parse application keys', function() {
          expect(target).to.have.property('applicationId', keys.applicationId);
          expect(target).to.have.property('restApiKey', keys.restApiKey);
          expect(target).to.have.property('masterKey', keys.masterKey);
          expect(target).to.have.property('useMasterKey', true);
        });
      });

      context('setting env variables', function() {
        var target;

        beforeEach(function() {
          process.env.NODE_PARSE_APP_ID = 'APP_ID';
          process.env.NODE_PARSE_REST_API_KEY = 'REST_API_KEY';
          process.env.NODE_PARSE_MASTER_KEY = 'MASTER_KEY';
          process.env.NODE_USE_PARSE_MASTER_KEY = '1';
        });

        afterEach(function() {
          target = null;
          delete process.env.NODE_PARSE_APP_ID;
          delete process.env.NODE_PARSE_REST_API_KEY;
          delete process.env.NODE_PARSE_MASTER_KEY;
          delete process.env.NODE_USE_PARSE_MASTER_KEY;
        });

        context('no input parameters', function() {
          beforeEach(function() {
            target = new TargetModule();
          });

          it('should be set the parse application keys', function() {
            expect(target).to.have.property('applicationId', process.env.NODE_PARSE_APP_ID);
            expect(target).to.have.property('restApiKey', process.env.NODE_PARSE_REST_API_KEY);
            expect(target).to.have.property('masterKey', process.env.NODE_PARSE_MASTER_KEY);
            expect(target).to.have.property('useMasterKey', true);
          });
        });

        context('input `useMasterKey` with true', function() {
          beforeEach(function() {
            target = new TargetModule({useMasterKey: false});
          });

          it('set the parse application keys, but `useMasterKey` is false', function() {
            expect(target).to.have.property('applicationId', process.env.NODE_PARSE_APP_ID);
            expect(target).to.have.property('restApiKey', process.env.NODE_PARSE_REST_API_KEY);
            expect(target).to.have.property('masterKey', process.env.NODE_PARSE_MASTER_KEY);
            expect(target).to.have.property('useMasterKey', false);
          });
        });
      });
    });

    describe('#keySet', function() {
      var target;

      beforeEach(function() {
        target = new TargetModule(keys);
      });

      afterEach(function() {
        target = null;
      });

      context('undefined `useMasterKey`', function() {
        it('return the keyset without `X-Parse-Master-Key`', function() {
          var result = target.keySet();
          expect(result).to.have.property('X-Parse-Application-Id', keys.applicationId);
          expect(result).to.have.property('X-Parse-REST-API-Key', keys.restApiKey);
          expect(result).to.not.have.property('X-Parse-Master-Key');
        });
      });

      context('set `options.useMasterKey` to true', function() {
        it('return the keyset with `X-Parse-Master-Key`', function() {
          var result = target.keySet({useMasterKey: true});
          expect(result).to.have.property('X-Parse-Application-Id', keys.applicationId);
          expect(result).to.have.property('X-Parse-REST-API-Key', keys.restApiKey);
          expect(result).to.have.property('X-Parse-Master-Key', keys.masterKey);
          expect(target).to.have.deep.property('useMasterKey')
            .that.to.not.be.true;
        });
      });

      context('set the property of `useMasterKey` to true', function() {
        beforeEach(function() {
          target.useMasterKey = true;
        });

        it('return the keyset with `X-Parse-Master-Key`', function() {
          var result = target.keySet();
          expect(result).to.have.property('X-Parse-Application-Id', keys.applicationId);
          expect(result).to.have.property('X-Parse-REST-API-Key', keys.restApiKey);
          expect(result).to.have.property('X-Parse-Master-Key', keys.masterKey);
          expect(target).to.have.deep.property('useMasterKey')
            .that.to.be.true;
        });
      });
    });

    describe('#pathJoin', function() {
      var target, apiVer;

      beforeEach(function() {
        target = new TargetModule();
        apiVer = target.apiVer || '1';
      });

      it('set the parse rest api paths', function() {
        var result = target.pathJoin('/', apiVer, 'classes', 'GameScore');
        expect(result).to.be.eql('/' + apiVer + '/classes/GameScore');
      });
    });
  });
}(this));
