import React, { useEffect, useState, useMemo } from 'react'
import {io} from "socket.io-client"
import { Box, Button, Container, Stack, TextField, Typography} from '@mui/material'
const App = () => {
  const socket = useMemo(()=> io("http://localhost:3000"),[]);

  //variable declare
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  //handle submit button
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", {message, room});
    setMessage("");
  };

  //handle join room
  const joinRoomHandle = (e) =>{
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect",() => {
      setSocketId(socket.id);
      console.log("connected",socket.id);
    });

    socket.on("receive-message",(data)=>{
      console.log(data);
      setAllMessages((messages) => [...messages, data]);
    });

    socket.on("welcome",(s)=>{console.log(s);});

    return () =>{
      socket.disconnect();
    };
  },[]);

  return (
    <Container maxWidth="sm">
      <Box sx={{height: 100}}/>
      <Typography variant='h3' component="div" gutterBottom>
        welcome to Socket.io
      </Typography>
      <Typography variant='h6' component="div" gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={joinRoomHandle}>
       <h5>Join Room</h5>
       <TextField 
        value={roomName} 
        onChange={(e)=>setRoomName(e.target.value)} 
        id='outlined-basic' 
        label="Room Name" 
        variant='outlined'/>
        <Button type='submit' variant= "contained" color="primary">Join</Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField 
        value={message} 
        onChange={(e)=>setMessage(e.target.value)} 
        id='outlined-basic' 
        label="Message" 
        variant='outlined'/>

        <TextField value={room} 
        onChange={(e)=>setRoom(e.target.value)} 
        id='outlined-basic' 
        label="Room" 
        variant='outlined'/>

        <Button type='submit' variant= "contained" color="primary">Send</Button>
      </form>
<Stack>
{
  allMessages.map((m, i) => (
    <Typography key={i} variant='h6' component="div" gutterBottom>{m}</Typography>

  ))
}
</Stack>
    </Container>
  );
};

export default App;
