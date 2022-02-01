const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});




io.on('connection', (socket)=> {
    console.log("SOCKETIO connection EVENT: ", socket.id, " client connected");



    socket.on('all_users', (msg) => {
      console.log(msg)
      io.emit('all_user_update', msg);
    });
  
    socket.on('all_rooms', (msg) => {
      console.log(msg)
      io.emit('all_room_update', msg);
    });
    
    socket.on('all_msgs', (msg) => {
      console.log(msg)
      io.emit('all_msgs_update', msg);
    });



    socket.on('joinRoom', function(msg) {     // joinRoom을 클라이언트가 emit 했을 시
        let roomName = msg;
        console.log(roomName)
        socket.join(roomName);    // 클라이언트를 msg에 적힌 room으로 참여 시킴
    });

    socket.on('leaveRoom', function(msg) {     // joinRoom을 클라이언트가 emit 했을 시
      let roomName = msg;
      console.log(roomName)
      socket.leave(roomName);    // 클라이언트를 msg에 적힌 room으로 참여 시킴
  });





    socket.on('chatting', function(msg) {       // 클라이언트가 채팅 내용을 보냈을 시
      console.log(msg)
        
      // 전달한 roomName에 존재하는 소켓 전부에게 broadcast라는 이벤트 emit
        io.to(msg.roomName).emit('broadcast', msg); 
    })
})








server.listen(port, () => console.log(`Listening on port ${port}`));