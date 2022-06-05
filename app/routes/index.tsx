import { Link } from '@remix-run/react';

export default function Index() {
  return (
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
      </ul>
    </div>
  );
}
