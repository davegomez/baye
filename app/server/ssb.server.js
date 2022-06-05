import caps from 'ssb-caps';
import Config from 'ssb-config/inject';
import SecretStack from 'secret-stack';

export function ssbServer() {
  if (global._ssbServer) {
    return global._ssbServer;
  }

  console.log('Starting SSB server');

  process.on('uncaughtException', function (err) {
    console.error(err);
  });

  const config = Config(null, {
    db2: {
      automigrate: true,
      dangerouslyKillFlumeWhenMigrated: true,
    },
  });

  const ssb = SecretStack({ caps })
    .use(require('ssb-db2'))
    .use(require('ssb-db2/compat'))
    .use(require('ssb-db2/about-self'))
    .use(require('ssb-blobs'))
    .use(require('ssb-friends'));

  global._ssbServer = ssb(config);

  return global._ssbServer;
}
