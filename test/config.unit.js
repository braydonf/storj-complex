'use strict';

var fs = require('fs');
var sinon = require('sinon');
var expect = require('chai').expect;
var HDKey = require('hdkey');
var complex = require('..');

var seed = 'a0c42a9c3ac6abf2ba6a9946ae83af18f51bf1c9fa7dacc4c92513cc4dd015834' +
    '341c775dcd4c0fac73547c5662d81a9e9361a0aac604a73a321bd9103bce8af';
var masterKey = HDKey.fromMasterSeed(new Buffer(seed, 'hex'));
var xpriv = 'xprv9xJ62Jwpr14Bbz63pamJV4Z3qT67JfqddRW55LR2bUQ38jty7G2TSVkE5Ro8' +
    'yYZjrJGVhN8Z3qvmM9XWgGvyceNMUj7xozR4LZS1eEFP5W3';
var hdKey = masterKey.derive('m/3000\'/0\'');

describe('Renter Config', function() {
  var sandbox = sinon.sandbox.create();
  afterEach(function() {
    sandbox.restore();
  });

  it('will create config with private key', function() {
    var config = {
      type: 'Renter',
      opts: {
        logLevel: 3,
        amqpUrl: 'amqp://localhost',
        amqpOpts: {},
        mongoUrl: 'mongodb://localhost:27017/storj-test',
        mongoOpts: {},
        networkPrivateKey: '/tmp/storj-complex/private.key',
        networkOpts: {
          rpcPort: 4000,
          rpcAddress: 'localhost',
          doNotTraverseNat: true,
          tunnelServerPort: 5000,
          tunnelGatewayRange: {
            min: 0,
            max: 0
          },
          maxTunnels: 0,
          seedList: [],
          bridgeUri: null,
          maxConnections: 250
        }
      }
    };
    var readFileSync = sandbox.stub(fs, 'readFileSync');
    readFileSync.onFirstCall().returns(JSON.stringify(config));
    readFileSync.onSecondCall().returns(new Buffer('key'));
    var conf = complex.createConfig('/tmp/somepath.json');
    expect(conf._.networkPrivateKey).to.equal('key');
  });

  it('will create config with extended private key', function() {
    var config = {
      type: 'Renter',
      opts: {
        logLevel: 3,
        amqpUrl: 'amqp://localhost',
        amqpOpts: {},
        mongoUrl: 'mongodb://localhost:27017/storj-test',
        mongoOpts: {},
        networkPrivateExtendedKey: '/tmp/storj-complex/hd-private.key',
        networkIndex: 10,
        networkOpts: {
          rpcPort: 4000,
          rpcAddress: 'localhost',
          doNotTraverseNat: true,
          tunnelServerPort: 5000,
          tunnelGatewayRange: {
            min: 0,
            max: 0
          },
          maxTunnels: 0,
          seedList: [],
          bridgeUri: null,
          maxConnections: 250
        }
      }
    };
    var readFileSync = sandbox.stub(fs, 'readFileSync');
    readFileSync.onFirstCall().returns(JSON.stringify(config));
    readFileSync.onSecondCall().returns(hdKey.privateExtendedKey);
    var conf = complex.createConfig('/tmp/somepath.json');
    expect(conf._.networkPrivateExtendedKey).to.equal(xpriv);
    expect(conf._.networkIndex).to.equal(10);
  });

});