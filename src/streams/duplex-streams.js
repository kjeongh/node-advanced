import { Duplex, PassThrough } from 'stream';
import fs from 'fs';

const readStream = fs.createReadStream('./src/resources/video.mp4');
const readStream2 = fs.createReadStream('./src/resources/video.mp4');
const duplexWriteStream = fs.createWriteStream('./src/resources/results/duplex.mp4');
const throttledWriteStream = fs.createWriteStream('./src/resources/results/throttled.mp4');

// 쓰로틀링을 위한 Duplex Stream
class Throttle extends Duplex {
    constructor(ms) {
        super();
        this.delay = ms;
    }

    _write(chunk, encoding, callback) {
        this.push(chunk);
        setTimeout(callback, this.delay);
    }

    _read(size) {}

    // 종료
    _final() {
        this.push(null);
    }
}

const duplexStream = new PassThrough();
const throttledStream = new Throttle(100);

// 원본 파이프
const duplexStart = Date.now();

readStream.pipe(duplexStream).pipe(duplexWriteStream);

duplexWriteStream.on('finish', () => {
    const duplexTime = Date.now() - duplexStart;
    console.log('[테스트 결과]-----------------------------');
    console.log('원본 파이프 수행시간: ', `${duplexTime}ms`);
});

// 쓰로틀링된 파이프
const throttledStart = Date.now();

readStream2.pipe(throttledStream).pipe(throttledWriteStream);

throttledWriteStream.on('finish', () => {
    const throttledTime = Date.now() - throttledStart;
    console.log('쓰로틀링 파이프 수행시간: ', `${throttledTime}ms`);
});
