import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';

@Injectable()
export class FileService {
  async uploadFile(path: string, file: any) {
    try {
      await writeFile(path, file.buffer);
      return path;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  // outros métodos para manipular arquivos
}
