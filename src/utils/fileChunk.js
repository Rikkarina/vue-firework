export class FileChunk {
  constructor(file) {
    this.file = file
    this.chunkSize = 2 * 1024 * 1024 // 2MB一片
    this.chunks = []
  }

  // 将文件切片
  createFileChunks() {
    const chunks = []
    let cur = 0
    while (cur < this.file.size) {
      chunks.push({
        index: chunks.length,
        file: this.file.slice(cur, cur + this.chunkSize),
      })
      cur += this.chunkSize
    }
    return chunks
  }
}
