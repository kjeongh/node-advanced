import { createServer } from 'http';
import { stat, createReadStream } from 'fs';
import { promisify } from 'util';

const fileName = './src/resources/video.mp4';
const fileInfo = promisify(stat);

createServer(async (req, res) => {

    // 파일 크기 조회
    const { size } = await fileInfo(fileName);;

    res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-Length': size,
    })

    // 브라우저로 영상 스트림 전송
    createReadStream(fileName).pipe(res);
    
}).listen(3000, () => {
    console.log('Server is running on port 3000');
});