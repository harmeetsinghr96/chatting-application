/**********************************
* Discription: Importing Packages *
**********************************/
const app = require("./src/app");
const debug = require("debug")("node-angular");
const http = require("http");
const Filter = require('bad-words');
const User = require('./src/models/user.model');
/***************************************
* Discription: creating port to listen *
***************************************/
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

/***********************************
* Discription: Handling error case *
***********************************/
const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/*******************************
* Discription: listing to port *
*******************************/
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/******************************************************
* Discription: making serveer and listen to all cases *
******************************************************/
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
const io = require('./src/socket.io').init(server);
io.on('connection', (socket) => {
  console.log('New client Connected.!!');
  socket.emit('connected');

  socket.on('join PM', (pm, cb) => {
    socket.join(pm.room1);
    socket.join(pm.room2);
    cb();
  });

  socket.on('new_message', (data) => {
    
    socket.to(data.room).emit('new msg', {
      text: data.message,
      sender: data.from
    });
  });

});
