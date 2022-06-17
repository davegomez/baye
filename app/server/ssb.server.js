import caps from 'ssb-caps'
import createConfig from 'ssb-config/inject'
import stack from 'secret-stack'

export const ssbServer = () => {
  if (global._ssbServer) {
    return global._ssbServer
  }

  console.log('Starting SSB server')

  process.on('uncaughtException', err => console.error(err))

  const config = createConfig(null, {
    db2: {
      automigrate: true,
      dangerouslyKillFlumeWhenMigrated: true,
    },
  })

  const ssb = stack({ caps })
    // Core
    .use(require('ssb-db2'))
    .use(require('ssb-db2/compat'))
    .use(require('ssb-db2/about-self'))
    // Replication
    .use(require('ssb-friends'))
    // Queries
    .use(require('ssb-db2/full-mentions'))
    // Blobs
    .use(require('ssb-blobs'))
    .use(require('ssb-serve-blobs'))

  global._ssbServer = ssb(config)

  return global._ssbServer
}
