const express = require('express')
const socketio = require('socket.io')
const path = require('path')

// Socket IO Server
const port = 9001
const io = socketio.listen(port)
console.log((new Date()) + ' Server is listening on port ' + port)
io.sockets.on('connection', socket => {
  socket.on('message', function (message) {
    console.log(message)
    socket.broadcast.emit('message', message)
  })
  socket.on('disconnect', socket => {
    console.log('disconnected')
    // socket.broadcast.emit('user disconnected')
  })
})

// Express Server
const app = express()
const staticPath = path.join(__dirname, '/public')
console.log(staticPath)
app.use(express.static(staticPath))
app.listen(3000, () => { console.log('listening on port 3000') })
