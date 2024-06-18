class SocketServices {
    constructor(io) {
        this.io = io
    }
    eventListeners() {
        this.io.on('connection', (socket) => {
            console.log(`User connected ${socket.id}`)
            socket.on('message', (data) => {
                console.log(`data received ${data}`)
            })
            socket.on('disconnect', () => {
                console.log(`User disconnected ${socket.id}`)
            })
        })
    }
}

export default SocketServices