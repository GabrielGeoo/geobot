import http from 'http';

export default function startBackgroundWorker() {
  http.createServer((req, res) => {
    res.write('Hello World!')
    res.end();
  }).listen(1337);
  console.log('Background worker started');
}