import net from 'net';
import { Writable } from 'stream';

const log = (message: string) => {
    process.stdout.write(`/r${message}`);
}

const myWritable = new Writable({
    write(chunk, encoding, callback) {
        const data = JSON.parse(chunk);
        const id = data.id;
        const message = data.message;

        if(message) {
            log(`${id} says: ${message}`);
        } else {
            // 최초 연결시 메세지 없으므로 자신의 id 출력
            log(`My ID: ${id}`);
        }
        
        log('Type something...:');

        callback(null, chunk);
    },
})

// 입력한것이 net서버를 통해 다시 출력됨
process.stdin.pipe(net.connect(3000)).pipe(myWritable);