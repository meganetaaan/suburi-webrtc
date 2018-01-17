const express = require('express')
const socketio = require('socket.io')

// Socket IO Server
const port = 9001
const io = socketio.listen(port)
console.log((new Date()) + ' Server is listening on port ' + port)
io.sockets.on('connection', socket => {
  socket.on('message', function (message) {
    socket.broadcast.emit('message', message)
  })
  socket.on('disconnect', socket => {
    socket.broadcast.emit('user disconnected')
  })
})

// Express Server
const app = express()
app.use(express.static('public'))
app.listen(3000, () => { console.debug('listening on port 3000') })
