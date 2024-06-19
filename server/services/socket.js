import Redis from "ioredis"
import dotenv from "dotenv";
dotenv.config();


const pub = new Redis({
    host: process.env.HOST,
    port: parseInt(process.env.REDISPORT),
    username: process.env.USER,
    password: process.env.PASSWORD
});

const sub = new Redis({
    host: process.env.HOST,
    port: parseInt(process.env.REDISPORT),
    username: process.env.USER,
    password: process.env.PASSWORD
});


class SocketServices {
    constructor(io) {
        this.io = io
        sub.subscribe("MESSAGES")
    }
    eventListeners() {
        this.io.on('connection', (socket) => {
            console.log(`User connected ${socket.id}`)
            socket.on('message-client', async (data) => {
                console.log(`data received ${data}`)
                await pub.publish('MESSAGES', JSON.stringify({ data }))
            })
            socket.on('disconnect', () => {
                console.log(`User disconnected ${socket.id}`)
            })
        })
        sub.on('message', async (channel, message) => {
            console.log(channel)
            if (channel === "MESSAGES") {
                this.io.emit('message-from-redis', message)
            }
        })
    }
}

export default SocketServices
