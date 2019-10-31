export default class BufferedReader {
  constructor(file) {
    this.file = file;
  }

  readLine = (chunkSize = 1024) => {
    if (chunkSize === 0) {
      return Promise.reject(
        `chunkSize should be greater than 0, got ${chunkSize}`
      );
    }

    return this._read("\n", chunkSize, 0, "");
  };

  _read = async (delimiter, chunkSize, offset, memo) => {
    // read a file chunk
    const { err, bytesRead, buffer } = await this._readChunk(offset, chunkSize);

    if (err) throw err;

    const chunk = this._parse(buffer, delimiter);

    // if we found the expected delimiter
    if (chunk.charAt(chunk.length - 1) === delimiter) {
      return memo + chunk.slice(0, -1);
    }

    // if reached eof
    if (bytesRead < chunkSize) {
      return memo + chunk;
    }

    const threshold = chunkSize * 128;

    // If we achieved a certain recursion deepness and don't find the expected
    // delimiter, throw an error
    if (offset > threshold) {
      throw `Unable to find delimiter: ${JSON.stringify(delimiter)}`;
    }

    // otherwise, keep searching
    return await this._read(
      delimiter,
      chunkSize,
      offset + chunkSize,
      memo + chunk
    );
  };

  _readChunk = (offset, size) => {
    const reader = new FileReader();
    const promise = new Promise((resolve, reject) => {
      reader.onloadend = function(progress) {
        const buffer = reader.result ? new Int8Array(reader.result, 0) : null;

        return resolve({
          err: progress.err,
          bytesRead: progress.loaded,
          buffer
        });
      };

      reader.readAsArrayBuffer(this.file.slice(offset, offset + size));
    });

    return promise;
  };

  _parse = (buffer, delimiter) => {
    let output = "";

    delimiter = delimiter.charCodeAt(0);
    buffer.some(code => {
      output += String.fromCharCode(code);

      return code === delimiter;
    });

    return output;
  };
}
