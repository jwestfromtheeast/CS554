import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import TopBar from "./TopBar";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import profilePic from "./Form.js";
import { Link } from "react-router-dom";

function Home(props){
    const [user,setUser] = useState(props.user)
    const [show,setShow] = useState(false)
    const [flag, setFlag] = useState(false)
    const [googleFlag, setGoogleFlag] = useState(false)
    const [newUsername,setNewUsername] = useState("")
    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    let img = "../public/images/default.jpg" 
    useEffect( () => {
        console.log(props)
        try{
            
            document.getElementsByTagName('canvas')[0].remove()
        }catch(e){
            console.log(e)
        }

    })
  function handleLogout(e) {
    e.preventDefault();
    try {
      localStorage.removeItem("username");
      location.reload(true);
    } catch (e) {}
  }

  function handleChangeUsername() {
    if (user.password != "") {
      setShow(true);
      setFlag(true);
    } else {
      setShow(true);
      setGoogleFlag(true);
    }
  }

  function handleChangePassword() {
    if (user.password != "") {
      setShow(true);
      setFlag(false);
    } else {
      setShow(true);
      setGoogleFlag(true);
    }
  }

  function handleClose() {
    setShow(false);
  }

  async function handleModal(e, url) {
    e.preventDefault();
    if (url === "changeUsername") {
      try {
        if (newUsername !== "" && password !== "") {
          let bod = {
            username: user.username,
            newUsername: newUsername,
            password: password,
          };
          const response = await fetch("http://localhost:3001/api/" + url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bod),
          });
          const js = await response.json();
          localStorage.setItem("username", newUsername);
          setUser(js);
          location.reload(true);
        }
      } catch (e) {
        window.alert("Something went wrong! Please try again later.");
      }
    } else if (url === "changePassword") {
      try {
        if (newPassword !== "" && password !== "") {
          let bod = {
            username: user.username,
            newPassword: newPassword,
            password: password,
          };
          const response = await fetch("http://localhost:3001/api/" + url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bod),
          });
          const js = await response.json();
          location.reload(true);
        }
      } catch (e) {
        window.alert("Something went wrong! Please try again later.");
      }
    }
  }

  function createModalBody() {
    if (googleFlag) {
      return (
        // <div>
        //     <p>Sorry, you can't change google credentials here.</p>
        //     <p>Please change your credentials through their channels.</p>
        // </div>
        <Form>
          <Form.Label>
            You appear to be logged in with google. Please change credentials
            through their channels.
          </Form.Label>
        </Form>
      );
    } else if (flag) {
      return (
        <Form>
          <Form.Group>
            <Form.Label>New Username</Form.Label>
            <Form.Control
              placeholder="Enter a new username"
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            onClick={(e) => handleModal(e, "changeUsername")}
          >
            Change
          </Button>
        </Form>
      );
    } else if (!flag) {
      return (
        <Form>
          <Form.Group>
            <Form.Label>New Password</Form.Label>
            <Form.Control
              placeholder="Enter a new password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter old Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            onClick={(e) => handleModal(e, "changePassword")}
          >
            Change
          </Button>
        </Form>
      );
    }
    }
    let x = "default.jpg"
    return(
        <div className = "webpage">
            <TopBar></TopBar>
            <h1 style={{marginTop: "150px"}}>Welcome {user.username}</h1>
            <div>
                {/* {console.log(`../public/images/`)} */}
                <img src= {require(`../public/images/${props.user.profilePic}`)} />
            </div>
            <Button variant ="secondary" onClick = {() => handleChangeUsername()}>Change Username</Button>
            <Button variant ="secondary" onClick = {() => handleChangePassword()}>Change Password</Button>
            <Button variant ="secondary" onClick = {(e) => handleLogout(e)}>Logout</Button>
            {/* <Button variant ="secondary">
                <Link to='/pp'>Change Profile Picture</Link>
            </Button> */}
            <Modal scrollable show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    {createModalBody()}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Link to="/pp">Change Profile Picture</Link>
            </Modal.Footer>
            </Modal>
            </div>
  );
}

export default Home;
