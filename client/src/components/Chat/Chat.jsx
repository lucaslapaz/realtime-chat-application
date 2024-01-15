import React, { useState, useEffect } from "react";
import queryString from "query-string";
import "./Chat.css";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";


let socket;

function Chat() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "192.168.3.9:5000";
  const location = useLocation();
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT, {
      transports: ["websocket", "polling", "flashsocket"],
    });

    setName(name);
    setRoom(room);

    console.log(socket);

    socket.emit("join", { name, room }, (error) => {
      if(error){
        window.alert(error);
      }
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, [messages]);


  function sendMessage(event){
    event.preventDefault();
    if(message){
        socket.emit('sendMessage', message, () => {
            setMessage('');
        })
    }
  }

  console.log(message, messages); 

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room}/>

        <Messages messages={messages} name={name} />

        <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
         
      </div>
      <TextContainer users={users}/>
    </div>
  );
}
export default Chat;
