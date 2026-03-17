const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const app = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

const COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c']

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

io.on('connection', (socket) => {
  const color = getRandomColor()
  console.log('A user connected:', socket.id)

  socket.emit('init', { color })

  socket.on('draw', (data) => {
    socket.broadcast.emit('draw', data)
  })

  socket.on('cursor', (data) => {
    socket.broadcast.emit('cursor', { ...data, id: socket.id, color })
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('cursor-remove', { id: socket.id })
    console.log('User disconnected:', socket.id)
  })
})

const PORT = 3001
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})