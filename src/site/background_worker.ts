import { createReadStream } from 'fs';
import http from 'http';
import registerRankData from '../utils/geoguessr_data/register_rank_data';

export default function startBackgroundWorker() {
  http.createServer((req, res) => {
    switch (req.url) {
      case '/':
        res.write('Hello World');
        res.end();
        break;
      case '/map':
        const file = createReadStream('src/site/index.html');
        file.pipe(res);
        file.on('end', () => {
          res.end();
        });
        break;
      case "/registerRanked": 
        registerRankData();
        res.end();
        break;
      default:
        res.write('404');
        res.end();
    }
  }).listen(8080);
  console.log('Background worker started');
}