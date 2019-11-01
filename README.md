# BufferedReader

A module to read text files in the browser without having to load the whole content into memory.

## API

### Constructor

Creates an instance of BufferedReader

```js
const bufferedReader = new BufferedReader(file);
```

Where `file` is a [HTML5 File](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications).

### ReadLine

Reads the next available line. This method can be called multiple times til `EOL` is reached.

```js
const line = await bufferedReader.readLine();
```

To check if the `EOL` is reached, you can query it by using `isEOL()`.

```js
while (!bufferedReader.isEOL()) {
  const line = await bufferedReader.readLine();
}
```

You can, optionally, defines the chunk size to be used when trying to read a line. The default is set to 1024 bytes, but it can be overridden when calling `readLine`.

```js
const line = await bufferedReader.readLine(2048);
const line = await bufferedReader.readLine(16);
```
