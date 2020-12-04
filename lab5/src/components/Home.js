import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <Jumbotron className="bg">
        <h1 className="custom-header">Hello, trainer!</h1>
        <p className="custom-txt">
          This is a site that will explain all of the Pokemon, Berries, and
          Machines you will encounter on your journey.
        </p>
        <p className="custom-txt">
          You will catch Pokemon to assist you on your quest, which can be fed
          Berries for various effects.
        </p>
        <p className="custom-txt">
          Pokemon can be taught new moves to use in battle using Machines, which
          are each detailed on their page.
        </p>
        <Link to="/pokemon/page/0">
          <h2>Pokemon Listing</h2>
        </Link>
        <Link to="/berries/page/0">
          <h2>Berry Listing</h2>
        </Link>
        <Link to="/machines/page/0">
          <h2>Machine Listing</h2>
        </Link>
      </Jumbotron>
    </div>
  );
}
