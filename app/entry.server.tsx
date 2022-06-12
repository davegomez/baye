import * as React from 'react'
import type {EntryContext} from '@remix-run/node'
import {RemixServer} from '@remix-run/react'
import {renderToString} from 'react-dom/server'
import {ssbServer} from '~/server/ssb.server'

/*
 * Initialize the SSB Server on first load
 */
ssbServer()

const handleRequest = (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) => {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />,
  )

  responseHeaders.set('Content-Type', 'text/html')

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}

export default handleRequest
