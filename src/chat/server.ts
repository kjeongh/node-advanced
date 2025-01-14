import { randomUUID } from 'crypto';
import net, { type Socket } from 'net';

const clients = new Map();

// net - TCP기반 서버/클라이언트 통신을 위한 비동기 API 제공
const server = net.createServer((socket) => {
    socket.pipe(socket)
})

server.on('connection', (socket: Socket) => {
    const id = randomUUID();
    console.log(`ID: ${id} connected`);

    clients.set(id, socket);

    socket.write(JSON.stringify({
        id
    }))
})

server.on('close', (socket) => {
    console.log(`${socket.id} clients disconnected`);
})

server.listen(3000, () => {
    console.log("Server is listening on port 3000");
})