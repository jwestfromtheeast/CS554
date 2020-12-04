import React, { useState, useEffect } from "react";
//import logo from './logo.svg';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login";
import Home from "./Home";
import GameDev from "./GameDev";
import Friends from "./Friends";
import Form from "./Form.js"
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function refreshHandler() {
      if (localStorage.getItem("username") && user === null) {
        let bod = { username: localStorage.getItem("username") };
        const response = await fetch("http://localhost:3001/api/get",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bod),
          }
        );
        const js = await response.json();
        if (js) setUser(js);
      }
    }
    refreshHandler();
  });

  return (
    <div className="App">
      <Router>
        <div>
          <Switch>
            <Route exact path="/">
              {user !== null ? (
                <Home user={user} />
              ) : (
                <Login onLogin={setUser} />
              )}
            </Route>
            <Route exact path="/pp">
            {user !== null ? <Form user={user} onProfilePicChange = {setUser}></Form> : <Redirect to="/" /> }
            </Route>
            <Route exact path="/friends">
              {user !== null ? <Friends user={user} /> : <Redirect to="/" />}
            </Route>
            <Route exact path="/game">
              {user !== null ? <GameDev user={user} /> : <Redirect to="/" />}
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
