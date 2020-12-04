import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Page404() {
  return (
    <div>
      <Jumbotron>
        <h1>404: Not found!</h1>
        <p>
          Click{' '}
          <Link aria-label="Click here to go home" className="over" to="/">
            here
          </Link>{' '}
          to return home.
        </p>
      </Jumbotron>
    </div>
  );
}
