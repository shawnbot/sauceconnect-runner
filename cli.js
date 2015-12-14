#!/usr/bin/env node
var yargs = require('yargs')
  .usage([
    '$0 [options] [--] [<test command>]',
    '\n\n',
    'You must provide your Sauce Labs username and access key, ',
    'either as options or as environment variables (see below).'
  ].join(''))
  .describe('user', 'your Sauce Labs username (defaults to $SAUCE_USERNAME)')
  .describe('key', 'your Sauce Labs access key (defaults to $SAUCE_ACCESS_KEY)')
  .describe('id', 'optional tunnel identifier')
  .describe('v', 'enable verbose logging')
  .describe('h', 'show this helpful message')
  .alias('user', 'u')
  .alias('key', 'k')
  .alias('h', 'help')
  .wrap(72);
require('colors');

var options = yargs.argv;
var args = options._;

// look for .env in the cwd and read it if it exists
var fs = require('fs');
var path = require('path');
var dotEnv = path.join(process.cwd(), '.env');
var env = require('require-env');
if (fs.existsSync(dotEnv)) {
  env.inherit(process.cwd() + '/.env');
}

// require-env.require() will throw an error if the
// named variable isn't set; catch these and show the help
try {
  var username = options.user || env.require('SAUCE_USERNAME');
  var accessKey = options.key || env.require('SAUCE_ACCESS_KEY');
} catch (error) {
  return yargs.showHelp();
}

var sauceConnect = require('sauce-connect-launcher');
var spawn = require('child_process').spawn;

var opt = {
  username: username,
  accessKey: accessKey,
  verbose: options.v,
  tunnelIdentifier: options.id,
  logger: function(message) {
    console.warn('[sc] %s'.yellow, message);
  }
};

sauceConnect(opt, function(error, tunnel) {
  if (error) throw new Error('error: %s'.red, error);

  function close(code) {
    if (code) console.warn('child process exited (%d)'.red, code);
    tunnel.close(function() {
      return process.exit(code);
    });
  }

  if (args.length) {

    console.warn('running: %s', args.join(' '));

    var env = Object.create(process.env);
    env.SAUCE_CONNECT = 1;

    spawn(args.shift(), args, {
      env: env,
      stdio: 'inherit'
    })
    .on('exit', close);

  } else {
    console.warn('Sauce Connect is running.'.green);
    // XXX this will probably not work because
    // the event loop no longer runs after an 'exit'
    process.on('exit', close);
  }
});
