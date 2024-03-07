import  express  from "express";
import { Server } from "socket.io";
import {createServer} from "http";
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors: {
        origin: "*",
        methods: ["GET","POST"],
        credentials: true,
    },
});

/*app.use(cors(
    {
        origin: "http://127.0.0.1:5173/",
        methods: ["GET","POST"],
        credentials: true,
    }
))*/

//get functions
app.get("/",(req,res)=>{
    res.send("ankit pawar");
});

io.on("connection",(socket)=>{
    console.log("user Connected");
    console.log("Id",socket.id);

    socket.on("message",(data)=>{
        console.log(data);
        //io.emit("receive-message", data); // emit message to all
        //socket.broadcast.emit("receive-message", data); //emit message to all except sending one
        io.to(data.room).emit("receive-message", data.message); //emit or send message to particular user
    });

    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`user joined ${room}`);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(3000,()=>{
    console.log("server started at port 3000");
});