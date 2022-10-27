const { literal } = require('zeno');

const { l, LiteralString } = literal;

const runQuery = (sql) => {
  if (sql instanceof LiteralString) {
    console.log(`This is a safe literal string: ${sql}`);
  } else {
    console.log(`Not a literal string, could be unsafe: ${sql}`);
  }
};

/**
 * @param {string} arbitraryString
 * @param {LiteralString} queryString
 * @param {LiteralString} tableName
 * @returns {void}
 */
const caller = (arbitraryString, queryString, tableName) => {
  runQuery(l`SELECT * FROM students`); // ok
  runQuery(queryString); // ok
  runQuery(l`SELECT * FROM ${tableName}`); // ok
  runQuery(arbitraryString); // type checker error
  runQuery(`SELECT * FROM students WHERE name = ${arbitraryString}`); // type checker error
};

userInput = 'foo';
caller(userInput, l`bar`, l`baz`);
