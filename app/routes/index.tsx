import * as React from 'react'
import { Link } from '@remix-run/react'

const Index = () => (
  <div>
    <h1>Welcome to Baye</h1>
    <ul>
      <li>
        <Link to="/profile/self" prefetch="intent">
          Profile
        </Link>
      </li>
      <li>
        <Link
          to="/profile/@QlCTpvY7p9ty2yOFrv1WU1AE88aoQc4Y7wYal7PFc+w=.ed25519"
          prefetch="intent"
        >
          Profile André
        </Link>
      </li>
      <li>
        <Link
          to="/profile/@9RSVfw4+fTzDRh3SiNWWhrR1fM9RT5fsRPw4QHtp4Ks=.ed25519"
          prefetch="intent"
        >
          Someone else
        </Link>
      </li>
    </ul>
  </div>
)

export default Index
