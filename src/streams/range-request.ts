import { createServer } from 'http';
import { stat, createReadStream } from 'fs';
import { promisify } from 'util';

const fileName = './src/resources/video.mp4';
const fileInfo = promisify(stat);

createServer(async (req, res) => {

    // 파일 크기 조회
    const { size } = await fileInfo(fileName);

    const range = req.headers.range; // bytes=0-100 형태
    console.log(req.headers);

    // 범위 요청 지원
    if(range) {
        const [start, end] = range.replace(/bytes=/, '').split('-');
        const startBytes = parseInt(start);
        const endBytes = end ? parseInt(end) : size - 1;

        res.writeHead(206, {
            'Content-Type': 'video/mp4',
            'Content-Length': (endBytes - startBytes) + 1,
            'Content-Range': `bytes ${startBytes}-${endBytes}/${size}`,
            'Accept-Range': 'bytes',
        })

        // 요청한 범위만큼만 전송
        createReadStream(fileName, { 
            start: startBytes,
            end: endBytes
        }).pipe(res);
    } else {
        res.writeHead(200, {
            'Content-Type': 'video/mp4',
            'Content-Length': size,
        })

        // 브라우저로 영상 스트림 전송
        createReadStream(fileName).pipe(res);
    }
    
}).listen(3000, () => {
    console.log('Server is running on port 3000');
});