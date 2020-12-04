import React, { useState, useEffect } from "react";
import {Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button';
import io from "socket.io-client";

//This isn't a functional component since it was giving my issues
class ChatGUI extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            messageText: "",
            prevMessages: []
        }
        this.socket = io("localhost:8080");
        this.socket.on("RECEIVE_MESSAGE", function(data){
            appendMessages(data)
        })
        
        this.socket.on("RECIEVE_INITIAL_MESSAGES",function(data){
            getInitial(data)
        })

        const appendMessages = data => {
            this.setState({prevMessages: [...this.state.prevMessages, data]})
        }

        const getInitial = data => {
            this.setState({prevMessages: data})
        }

        this.sendMessage = e => {
            e.preventDefault();
            this.socket.emit('SEND_MESSAGE', {
                author: this.props.senderID,
                message: this.state.messageText
            })
            this.setState({messageText: ''});
           
            //document.getElementsByClassName("inputText")[0].setAttribute()
        }
       
    }
    componentDidMount(){
        this.socket.emit('GET_ALL_MESSAGES')

    }
    
    render(){
        return(
            <div style = {{marginTop:"100px"}}>
                {this.state.prevMessages.map( (item,i) => {
                  
                    return(  
                        <div id = {"key" + i} ><p>{item.author} : {item.message}</p></div>
                    )
                })}
                <Form>
                    <Form.Group>
                        <Form.Control className = "inputText"
                        placeholder = "Enter a message" value = {this.state.messageText}
                        onChange={(e) => this.setState({messageText: e.target.value})}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick = {this.sendMessage}>
                            Send
                    </Button>
                </Form>
            </div>
        )
    }

}

// function ChatGUI(props){
//     const [senderID,setSenderID] = useState(props.sendID)
//     const [messageText,setMessageText] = useState(null)
//     const [prevMessages, setPrevMessages] = useState([])

//     useEffect( () => {
//         socket.on('RECEIVE_MESSAGE', function(data){
//             setPrevMessages(prevMessages.push(data))
//         });
//     },[])

//     function displayMessages(){
//         prevMessages.map( (item) => {
//             return(
//                 <span><p>{item}</p></span>
//             )
//         })

//     }


//     function sendMessage(){
       
//         socket.emit('SEND_MESSAGE', {
//             author: senderID,
//             message: messageText
//         });
//         setMessageText("");
//     }

    
//     return(
//         <div>

//             {displayMessages()}
//             <Form>
//                 <Form.Group>
//                     <Form.Control
//                     placeholder = "Enter a message"
//                     onChange={(e) => setMessageText(e.target.value)}
//                     />
//                 </Form.Group>
//                 <Button variant="primary" type="submit" onClick = {sendMessage()}>
//                         Send
//                 </Button>
//             </Form>
//         </div>
//     )


// }

export default ChatGUI