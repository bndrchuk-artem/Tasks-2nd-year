'use strict';

const fs = require('fs');
const readline = require('readline');

function sumColumn(filePath, columnName) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });
  });
}
