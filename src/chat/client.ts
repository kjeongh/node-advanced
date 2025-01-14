import net from 'net';

// 입력한것이 net서버를 통해 다시 출력됨
process.stdin.pipe(net.connect(3000)).pipe(process.stdout);