import BufferedReader from "../src/index.js";

test("Empty line ending file", () => {
  const line = "lorem ipsum";
  const file = new File([`${line}\n`], "f.txt");
  const bufferedReader = new BufferedReader(file);

  bufferedReader.readLine().then(readLine => expect(readLine).toEqual(line));
});

test("Non empty line ending file", () => {
  const line = "lorem ipsum";
  const file = new File([line], "f.txt");
  const bufferedReader = new BufferedReader(file);

  bufferedReader.readLine().then(readLine => expect(readLine).toEqual(line));
});

test("Throws an error when expected smaller line lenght", () => {
  const longLine = "foo".repeat(100);
  const file = new File([longLine], "f.txt");
  const bufferedReader = new BufferedReader(file);

  bufferedReader.readLine(1).catch(e => expect(e).toMatch("error"));
});

test("Throws an error when providing invalid chunk size", () => {
  const file = new File([], "f.txt");
  const bufferedReader = new BufferedReader(file);

  bufferedReader.readLine(0).catch(e => expect(e).toMatch("error"));
});
