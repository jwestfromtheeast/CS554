import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { Form } from "react-bootstrap";
import firebase from "firebase/app";
import "firebase/auth";
import fb from "./firebase"
import Modal from "react-bootstrap/Modal";
import { FcGoogle } from "react-icons/fc";
import "./Login.css";

//need to put a try catch around all the login features and anything else that uses mongo
//import {Redirect } from "react-router-dom";
function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  // useEffect(() => {
  //     console.log(props)
  // })
  
  async function handleSignIn(e) {
    e.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(async (result) => {
          let bod = { username: result.user.displayName };
         
          const response = await fetch("http://localhost:3001/api/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bod),
          });
          const js = await response.json();
          if (js.username) {
            window.localStorage.setItem("username", js.username);
            props.onLogin(js);
          }

          //const acc =accounts.createFromGoogleLogin(result.user.displayName)
          //props.onLogin(acc)
        });
    } catch (e) {
      window.alert("Something went wrong! Please try again later.")
    }
  }

  async function handleNormalSignIn(e) {
    e.preventDefault();
    if (username !== "" && password !== "") {
      try{
        let bod = { username: username, password: password };
        const response = await fetch("http://localhost:3001/api/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(bod),
        });
        const js = await response.json();
        //console.log(js)
        if(response.status === 400){
            window.alert("Invalid login information")
        }

        if (js.username) {
            window.localStorage.setItem("username", js.username);
            props.onLogin(js);
        }
      }catch(e){
        window.alert("Something went wrong! Please try again later.")
      }
    }
  }

  async function handleNormalCreate(e) {
    //const acc = accounts.create(username,password)
    //props.onLogin(acc)
    e.preventDefault();
    if (username !== "" && password !== "") {
      try{
        let bod = { username: username, password: password };
        const response = await fetch("http://localhost:3001/api/create", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(bod),
        });
        const js = await response.json();
        //console.log(js)
        if (js.username) {
            window.localStorage.setItem("username", js.username);
            props.onLogin(js);
        }
      }catch(e){
        window.alert("Something went wrong! Please try again later.")
      }
    }
  }

  function createForm(flag) {
    if (flag) {
      return (
        <Form className="form-signin">
          <Form.Group className="form-label-group">
            <Form.Label>Username</Form.Label>
            <Form.Control
              placeholder="Username"
              required
              autofocus
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group
            className="form-label-group"
            controlId="formBasicPassword"
          >
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <button
            className="btn btn-lg btn-primary btn-block"
            onClick={(e) => handleNormalCreate(e)}
          >
            Sign Up
          </button>
        </Form>
      );
    }
    return (
      <Form className="form-signin">
        <Form.Group className="form-label-group">
          <Form.Label>Username</Form.Label>
          <Form.Control
            required
            autofocus
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <button
          className="btn btn-lg btn-primary btn-block"
          type="submit"
          onClick={(e) => handleNormalSignIn(e)}
        >
          Sign In
        </button>
        <button
          className="btn btn-lg btn-primary btn-block"
          onClick={() => setShow(true)}
        >
          Sign Up
        </button>
      </Form>
    );
  }

  return (
    <div className="webpage">
      <div className="container">
        <div className="row">
          <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card card-signin my-5">
              <div className="card-body">
                <h2 className="card-title text-center">Login</h2>
                <div>{createForm(false)}</div>
                <hr class="my-4"></hr>
                <Button onClick = {(e) => handleSignIn(e)}>Sign In With Google</Button>
                <Modal show={show} onHide={() => setShow(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Sign Up</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>{createForm(true)}</Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
