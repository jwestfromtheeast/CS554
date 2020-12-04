import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";
import TopBar from "./TopBar";
import "./Friends.css";
import ChatGUI from "./chatStuff/ChatGUI";
//import * as accounts from "./mongo/accounts";
//these ids will be used for our comet chat ids too
// const friends = [{
//     _id: "1",
//     username: "SafariDan",
//     email: "s@s",
//     profilePic: "",
//     friendsList: []
// }, {
//     _id: "2",
//     username: "Myon",
//     email: "m@m",
//     profilePic: "",
//     friendsList: []
// }]

function Friends(props) {
  const [friendList, setFriendList] = useState([]);
  const [chatUID, setChatUID] = useState("");
  const [show, setShow] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [flag, setFlag] = useState(true);
  useEffect(() => {
    try {
      document.getElementsByTagName("canvas")[0].remove();
    } catch (e) {}
    //need to do a db call here to get friends list
    //will harcode a few friends for now.
    //const ls = accounts.get(props.user.username)
    if (flag) {
      //console.log(props.user.friends)
      setFriendList(props.user.friends);
      setFlag(false);
    }
  }, [flag]);

  function handleClose() {
    setChatUID("");
    setShow(false);
  }
  function handleShow(uid) {
    //this uid used here should be in the state
    //the one passed in corresponds to whom were trying to chat with
    //I also need to pass the current users uid to do login
    setShow(true);
  }

  //will be used as the way to add friends
  //can search by username, obviously will need db stuff here too
  async function searchUsers(e, searchTerm) {
    //console.log(searchTerm)
    e.preventDefault();
    try {
      let bod = { searchTerm: searchTerm };
      const response = await fetch("http://localhost:3001/api/getSearch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bod),
      });
      const searchRes = await response.json();
      setSearchResults(searchRes);
    } catch (e) {}
  }

  async function addFriend(e, name) {
    e.preventDefault();
    try {
      if (!friendList.includes(name)) {
        let bod = { username: props.user.username, friendName: name };
        const response = await fetch("http://localhost:3001/api/addFriend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bod),
        });
        const updatedUser = await response.json();
        setFriendList(updatedUser.friends);
      }
    } catch (e) {
      window.alert("Something went wrong! Please try again later.");
    }
    window.location.reload();
  }

  async function removeFriend(e, name) {
    e.preventDefault();
    try {
      let bod = { username: props.user.username, friendName: name };
      const response = await fetch("http://localhost:3001/api/removeFriend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bod),
      });
      const updatedUser = await response.json();
      if (updatedUser.friends) setFriendList(updatedUser.friends);
      else setFriendList([]);
    } catch (e) {
      window.alert("Something went wrong! Please try again later.");
    }
    window.location.reload();
  }

  function createSearchResults() {
    try {
      return (
        <Container className="friendContainer">
          <h2>Search Results</h2>
          {searchResults.map((item) => {
            if (item.username !== props.user.username)
              return (
                <Row key={item}>
                  <div className="friend-row">
                    <Col>
                      <div>
                        <img
                          className="profile"
                          src="http://www.barbalace.it/antonio/photos/abarbala.jpeg"
                        />
                      </div>
                    </Col>
                    <Col>
                      <div>
                        <p className="uname">{item.username}</p>
                      </div>
                    </Col>
                    <Col>
                      <div>
                        <Button
                          onClick={(e) => addFriend(e, item.username)}
                          variant="secondary"
                        >
                          Add
                        </Button>
                      </div>
                    </Col>
                  </div>
                </Row>
              );
          })}
        </Container>
      );
    } catch (e) {
      return;
    }
  }

  function createFriendsList() {
    try {
      return (
        <Container>
          <h1>My Friends</h1>
          {friendList.map((item) => {
            return (
              <Row key={item}>
                <div className="friend-row">
                  <Col>
                    <div>
                      <img
                        className="profile"
                        src="http://www.barbalace.it/antonio/photos/abarbala.jpeg"
                      />
                    </div>
                  </Col>
                  <Col>
                    <div>
                      <p className="uname">{item}</p>
                    </div>
                  </Col>
                  <Col>
                    <div>
                      <Button
                        onClick={(e) => removeFriend(e, item)}
                        variant="danger"
                      >
                        Remove
                      </Button>
                    </div>
                  </Col>
                </div>
              </Row>
            );
          })}
        </Container>
      );
    } catch (e) {
      return;
    }
  }

  return (
    <div className="webpage">
      <TopBar></TopBar>
      <div className="container">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card card-signin my-5">
              <div className="card-body">
                {createFriendsList()}
                <div>
                  <Form>
                    <Form.Group>
                      <Form.Control
                        placeholder="Enter a username to search"
                        onChange={(e) => searchUsers(e, e.target.value)}
                      />
                    </Form.Group>
                  </Form>
                  {createSearchResults()}
                </div>
                <div>
                  <Button
                    onClick={() => handleShow()}
                    variant="primary"
                    size="lg"
                  >
                    Open Global Chat
                  </Button>
                </div>
                {/* chat logic will all go inside this modal */}
                <Modal scrollable show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Chat</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <ChatGUI senderID={props.user.username}></ChatGUI>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
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

export default Friends;
