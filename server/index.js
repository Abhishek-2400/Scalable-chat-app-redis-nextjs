import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import SocketServices from "./services/socket.js";

dotenv.config();

const startServer = async () => {
    const port = process.env.PORT || 4000;
    const server = http.createServer();
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:3000"],
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    const socketServices = new SocketServices(io);
    socketServices.eventListeners()

    server.listen(port, () => {
        console.log(`Server is listening at ${port}`);
    });
};

startServer();
