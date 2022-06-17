import * as React from 'react'
import {json} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import {Tooltip, TooltipAnchor, useTooltipState} from 'ariakit/tooltip'
import {
  BanIcon,
  PencilIcon,
  UserAddIcon,
  UsersIcon,
} from '@heroicons/react/solid'
import clsx from 'clsx'
import {getProfile} from '~/server/api.server'
import {ssbServer} from '~/server/ssb.server'
import {compileMarkdown, preProcessMarkdown} from '~/utils/markdown.server'
import {Button, Markdown} from '~/ui'

import type {LoaderFunction} from '@remix-run/node'

type LoaderData = {
  description: string
  following?: boolean
  feedId: string
  image: string
  imageBlob: string
  isSelf: boolean
  name: string
}

export const loader: LoaderFunction = async ({params: {feedId}}) => {
  const ssb = ssbServer()
  const feed = await getProfile(ssb, feedId)

  const processedMarkdown = await preProcessMarkdown(feed.description)
  const {code} = await compileMarkdown(processedMarkdown.value.toString())

  return json({
    ...feed,
    description: code,
  })
}

const FeedId = () => {
  const {description, following, feedId, image, imageBlob, isSelf, name} =
    useLoaderData<LoaderData>()
  const idTooltip = useTooltipState()

  return (
    <>
      <div>
        <div>
          <img
            className="h-32 w-full object-cover lg:h-48"
            src="https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt=""
          />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div className="flex">
              <img
                className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                src={`data:image/jpg;base64,${imageBlob}`}
                alt=""
              />
            </div>
            <div className="mt-4 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div className="sm:hidden mt-4 min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {name}
                </h1>
                <TooltipAnchor
                  state={idTooltip}
                  className="flex-1 max-w-fit cursor-pointer"
                >
                  <code className="block truncate">{feedId}</code>
                </TooltipAnchor>
              </div>
              <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                {isSelf ? (
                  <Button type="button">
                    <PencilIcon
                      className="leading-icon text-white"
                      aria-hidden="true"
                    />
                    <span>Edit</span>
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant={following ? 'primary' : 'white'}
                    >
                      {following ? (
                        <UsersIcon
                          className={clsx(
                            'leading-icon',
                            following ? 'text-white' : 'text-gray-400',
                          )}
                          aria-hidden="true"
                        />
                      ) : (
                        <UserAddIcon
                          className={clsx(
                            'leading-icon',
                            following ? 'text-white' : 'text-gray-400',
                          )}
                          aria-hidden="true"
                        />
                      )}
                      <span>{following ? 'Following' : 'Follow'}</span>
                    </Button>
                    <Button type="button" variant="error">
                      <BanIcon
                        className="leading-icon text-white"
                        aria-hidden="true"
                      />
                      <span>Block</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="hidden sm:block mt-4 min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-gray-900 truncate">
              {name}
            </h1>
            <TooltipAnchor
              state={idTooltip}
              className="flex-1 max-w-fit cursor-pointer"
            >
              <code className="block truncate">{feedId}</code>
            </TooltipAnchor>
          </div>
        </div>
        <Markdown content={description} />
      </div>
      <Tooltip state={idTooltip} className="tooltip">
        Copy to clipboard
      </Tooltip>
    </>
  )
}

export default FeedId
