import { TextDecoder } from "text-encoding";

export default class BufferedReader {
  constructor(file) {
    this._file = file;
    this._cursor = 0;
    this._isEOL = false;
  }

  readLine = (chunkSize = 1024) => {
    if (chunkSize === 0) {
      return Promise.reject(
        new Error(`chunkSize should be greater than 0, got ${chunkSize}`)
      );
    }

    return this._read("\n", chunkSize, "");
  };

  isEOL = () => this._isEOL;

  _read = async (delimiter, chunkSize, memo) => {
    // read a file chunk
    const { err, buffer } = await this._readChunk(chunkSize);

    if (err) throw err;

    const [chunk, tail] = this._parse(buffer, delimiter);

    const bytesRead = chunk.length;
    this._updateCursor(bytesRead, tail != null);

    // if we found the expected delimiter
    if (tail != null) {
      return memo + chunk;
    }

    // if reached EOF
    if (bytesRead < chunkSize) {
      this._isEOL = true;

      return memo + chunk;
    }

    const threshold = chunkSize * 128;

    // If we achieved a certain recursion deepness and don't find the expected
    // delimiter, throw an error
    if (this._cursor > threshold) {
      throw new Error(`Unable to find delimiter: ${JSON.stringify(delimiter)}`);
    }

    // otherwise, keep searching
    return this._read(delimiter, chunkSize, memo + chunk);
  };

  _readChunk = size => {
    const reader = new window.FileReader();

    return new Promise(resolve => {
      reader.onloadend = progress => {
        const buffer = reader.result ? new Int8Array(reader.result, 0) : null;

        return resolve({
          err: progress.err,
          buffer
        });
      };

      reader.readAsArrayBuffer(
        this._file.slice(this._cursor, this._cursor + size)
      );
    });
  };

  _parse = (buffer, delimiter) => {
    return new TextDecoder().decode(buffer).split(delimiter);
  };

  _updateCursor(chunkSize, skipSeparator) {
    this._cursor += chunkSize + (skipSeparator ? 1 : 0);
  }
}
