import * as React from 'react'
import {Outlet} from '@remix-run/react'

export default function ProfileRoute() {
  return (
    <div>
      <h1>Profile</h1>
      <Outlet />
    </div>
  )
}
