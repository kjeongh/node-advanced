import { stdout } from 'process';
import { Transform, Readable } from 'stream';

const numbers: string[] = ['1', '2', '3', '4', '5'];

class AddStream extends Transform {
    constructor() {
        super();
    }

    _transform(chunk: Buffer, encoding: string, callback: Function) {
        // chunk를 문자열로 변환한 후 숫자로 처리
        const result = Number(chunk.toString()) + 1;

        // result를 문자열로 변환하여 푸시
        this.push(result.toString() + '\n');
        callback();
    }

    // 데이터 스트림이 끝나면 더 추가 가능
    _flush(callback: Function) {
        callback();
    }
}

class MultiplyStream extends Transform {
    constructor() {
        super();
    }

    _transform(chunk: Buffer, encoding: string, callback: Function) {
        // chunk를 문자열로 변환한 후 숫자로 처리
        const number = Number(chunk.toString());
        const result = number * number;

        // result를 문자열로 변환하여 푸시
        this.push(result.toString() + '\n');
        callback();
    }

    // 데이터 스트림이 끝나면 더 추가 가능
    _flush(callback: Function) {
        callback();
    }
}

interface IConverter {
    convert(numbers: string[]): void;
}

class AddConverter implements IConverter {
    _stream: Transform;

    constructor() {
        this._stream = new AddStream();
    }

    convert(numbers: string[]) {
        const numStream = Readable.from(numbers);
        const addStream = this._stream;

        numStream.pipe(addStream).pipe(stdout);
    }
}

class MultiplyConverter implements IConverter {

    _stream: Transform;

    constructor() {
        this._stream = new MultiplyStream();
    }

    convert(numbers: string[]) {
        const numStream = Readable.from(numbers);
        const multiplyStream = this._stream;

        numStream.pipe(multiplyStream).pipe(stdout);
    }
}

const addConverter = new AddConverter();
const multiplyConverter = new MultiplyConverter();

addConverter.convert(numbers);
console.log('--------------------------------');
multiplyConverter.convert(numbers);
