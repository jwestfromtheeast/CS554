import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './components/Home';
import PokemonPage from './components/PokemonPage';
import Pokemon from './components/Pokemon';
import Berries from './components/Berries';
import BerriesPage from './components/BerriesPage';
import Machines from './components/Machines';
import MachinesPage from './components/MachinesPage';
import Page404 from './components/Page404';

export default function App() {
  return (
    <Router>
      <Navbar background="light" expand="lg">
        <LinkContainer to="/">
          <Navbar.Brand>Pokemon</Navbar.Brand>
        </LinkContainer>
        <Nav>
          <LinkContainer to="/pokemon/page/0">
            <Button className="custom-btn">Pokemon Listing</Button>
          </LinkContainer>
          <LinkContainer to="/berries/page/0">
            <Button className="custom-btn">Berry Listing</Button>
          </LinkContainer>
          <LinkContainer to="/machines/page/0">
            <Button className="custom-btn">Machine Listing</Button>
          </LinkContainer>
        </Nav>
      </Navbar>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route
          path="/pokemon/page/:page"
          exact
          children={<PokemonPage />}
        ></Route>
        <Route path="/pokemon/:id" exact children={<Pokemon />}></Route>
        <Route
          path="/berries/page/:page"
          exact
          children={<BerriesPage />}
        ></Route>
        <Route path="/berries/:id" exact children={<Berries />}></Route>
        <Route
          path="/machines/page/:page"
          exact
          children={<MachinesPage />}
        ></Route>
        <Route path="/machines/:id" exact children={<Machines />}></Route>
        <Route path="*">
          <Page404 />
        </Route>
      </Switch>
    </Router>
  );
}
