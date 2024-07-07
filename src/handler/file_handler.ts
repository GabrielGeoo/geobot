import { GridFSBucket, GridFSBucketReadStream } from 'mongodb';

export default class FileHandler {

  private static gfs: GridFSBucket;

  public static init(gfs: GridFSBucket) {
    this.gfs = gfs;
  }

  public static writeImage(buffer: Buffer, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!FileHandler.gfs) {
        return reject(new Error('GridFSBucket is not initialized'));
      }
      const uploadStream = FileHandler.gfs.openUploadStream(filename);
      uploadStream.write(buffer, (err) => {
        if (err) {
          return reject(err);
        }
        uploadStream.end((endErr: any) => {
          if (endErr) {
            return reject(endErr);
          }
          resolve(uploadStream.id.toString());
        });
      });
    });
  }

  public static getImage(filename: string): Promise<Buffer | null> {
    return new Promise((resolve, reject) => {
      if (!FileHandler.gfs) {
        return reject(new Error('GridFSBucket is not initialized'));
      }
      const downloadStream: GridFSBucketReadStream = this.gfs.openDownloadStreamByName(filename);
      const chunks: Buffer[] = [];

      downloadStream.on('data', (chunk) => {
        chunks.push(chunk);
      });

      downloadStream.on('error', (err) => {
        if (err.message.startsWith('FileNotFound')) {
          return resolve(null);
        }
        reject(err);
      });

      downloadStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    });
  };
}