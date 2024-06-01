import { createReadStream } from 'fs';
import http from 'http';

export default function startBackgroundWorker() {
  http.createServer((req, res) => {
    const file = createReadStream('src/site/index.html');
    file.pipe(res);
    file.on('end', () => {
      res.end();
    });
  }).listen(8080);
  console.log('Background worker started');
}