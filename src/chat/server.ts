import { randomUUID } from 'crypto';
import EventEmitter from 'events';
import net, { type Socket } from 'net';
import { Writable } from 'stream';

// 현재 접속한 클라이언트 목록
const clients = new Map();

// 전송자를 제외한 접속자에게 브로드캐스트
const broadCastToClients = (senderSocketId, data) => {
    [...clients.values()]
        .filter((clientSocket) => clientSocket.id !== senderSocketId)
        .forEach((clientSocket) => {
            clientSocket.write(data);
        })
}

const broadCastViaStream: (socket: Socket) => Writable = (socket: Socket) => {
    return new Writable({
        write(chunk, encoding, callback) {
            const data = JSON.stringify({
                message: chunk.toString(),
                id: socket.id.slice(0, 5)
            })

            broadCastToClients(socket.id, data);

            callback(null, chunk);
        }
    })
}

// net - TCP기반 서버/클라이언트 통신을 위한 비동기 API 제공
const server = net.createServer((socket) => {
    socket.pipe(broadCastViaStream(socket));
})

server.on('connection', (socket: Socket) => {
    const id = randomUUID();
    console.log(`ID: ${id} connected`);

    clients.set(id, socket);

    socket.write(JSON.stringify({
        id
    }))
})

server.on('close', (socket: Socket) => {
    console.log(`${socket.id} clients disconnected`);
})

server.listen(3000, () => {
    console.log("Server is listening on port 3000");
})