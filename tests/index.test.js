import BufferedReader from "../src";

test("Empty line ending file", async () => {
  const line = "lorem ipsum";
  const file = new File([`${line}\n`], "f.txt");
  const bufferedReader = new BufferedReader(file);
  const got = await bufferedReader.readLine();

  expect(got).toEqual(line);
});

test("Reads consecutive lines", async () => {
  const expected = "lorem ipsum";
  const file = new File([`foo bar\n${expected}`], "f.txt");
  const bufferedReader = new BufferedReader(file);

  await bufferedReader.readLine(); // discard first line
  const got = await bufferedReader.readLine();

  expect(got).toEqual(expected);
});

test("Reaches EOL", async () => {
  const line = "lorem ipsum";
  const file = new File([line], "f.txt");
  const bufferedReader = new BufferedReader(file);

  expect(bufferedReader.isEOL()).toBeFalsy();
  await bufferedReader.readLine();
  expect(bufferedReader.isEOL()).toBeTruthy();
});

test("Non empty line ending file", async () => {
  const line = "lorem ipsum";
  const file = new File([line], "f.txt");
  const bufferedReader = new BufferedReader(file);
  const got = await bufferedReader.readLine();

  expect(got).toEqual(line);
});

test("Throws an error when expected smaller line lenght", async () => {
  const longLine = "foo".repeat(100);
  const file = new File([longLine], "f.txt");
  const bufferedReader = new BufferedReader(file);

  await expect(bufferedReader.readLine(1)).rejects.toThrow();
});

test("Throws an error when providing invalid chunk size", async () => {
  const file = new File([], "f.txt");
  const bufferedReader = new BufferedReader(file);

  await expect(bufferedReader.readLine(0)).rejects.toThrow();
});
